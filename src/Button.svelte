<script lang="ts">
	import { ready, cooldown } from "./stores/ready";
	import { clicksLeft } from "./stores/clicksLeft";
	import { wins } from "./stores/wins";

	let shake = true;
	let progress = 0;

	const updateProgress = () => {
		const progressInterval = setInterval(() => {
			progress = (($ready - Date.now()) / cooldown) * 100;
			progress = Number(progress.toFixed(2)); //truncate to 2 d.p

			if (0 > progress || progress > 100) {
				clearInterval(progressInterval);
				progress = Math.min(Math.max(progress, 0), 100); // clamp between 0 and 100
			}
		}, 16); //60fps
	};

	updateProgress();

	const handleClick = () => {
		// shake button
		if ($clicksLeft === 0) {
			shake = false;
			setTimeout(() => {
				shake = true;
			}, 1);
		}

		if ($clicksLeft > 0) {
			if ($ready <= Date.now()) {
				$clicksLeft--;

				socket.send("add");

				ready.set(Date.now() + cooldown);
				console.log("set ready");

				updateProgress();

				// send click to server...

				console.log("clicked");
			} else {
				console.log("not ready");
			}
		}
	};

	let socket: WebSocket;
	const openSocket = () => {
		socket = new WebSocket("ws://localhost:8999");
	};
	openSocket();

	socket.onopen = () => console.log("opened");

	socket.onclose = () => openSocket();

	socket.onmessage = (message) => {
		console.log(message.data);
		if (message.data === "win") {
			$wins += 1;
		}
	};

	let firedFirst = false;
	wins.subscribe(() => {
		if (!firedFirst) firedFirst = true;
		else {
			console.log("yay!");
		}
	});
</script>

<button
	class:timeout={$clicksLeft === 0}
	class:ready={progress === 0}
	class:shake
	on:click={handleClick}
>
	<span>
		{$clicksLeft.toLocaleString()}
	</span>
	<div
		class="progress"
		data-progress={progress}
		style={`width: ${progress}%`}
	/>
</button>

{#if $clicksLeft === 0}
	<p>no more clicks left for today</p>
{/if}

<style lang="scss">
	$offset: 7px;
	$blur: 14px;

	@mixin tan-button {
		border-radius: 15%;
		background: #e8dfca;
		box-shadow: $offset $offset $blur #ccc4b2,
			calc(-1 * $offset) calc(-1 * $offset) $blur #fffae2,
			inset $offset $offset $blur transparent,
			inset calc(-1 * $offset) calc(-1 * $offset) $blur transparent;

		&.ready:active {
			color: black;
			border-radius: 15%;
			background: #e8dfca;
			box-shadow: $offset $offset $blur transparent,
				calc(-1 * $offset) calc(-1 * $offset) $blur transparent,
				inset $offset $offset $blur #ccc4b2,
				inset calc(-1 * $offset) calc(-1 * $offset) $blur #fffae2;
		}
	}

	@mixin red-button {
		color: white !important;
		border-radius: 15%;
		background: #da2f2f;
		box-shadow: $offset $offset $blur #ccc4b2,
			calc(-1 * $offset) calc(-1 * $offset) $blur #fffae2,
			inset $offset $offset $blur transparent,
			inset calc(-1 * $offset) calc(-1 * $offset) $blur transparent;

		/* &:active {
			color: white !important;
			border-radius: 15%;
			background: #da2f2f;
			box-shadow: $offset $offset $blur transparent,
				calc(-1 * $offset) calc(-1 * $offset) $blur transparent,
				inset $offset $offset $blur #c02929,
				inset calc(-1 * $offset) calc(-1 * $offset) $blur #f43535;
		} */
	}

	/* .timeout {
		// color: hsl(35, 34%, 45%);
	} */

	.timeout.shake {
		@keyframes shake {
			0% {
				transform: translateX(0) rotate(0);
			}

			25% {
				transform: translateX(10px) rotate(1deg);
				@include red-button();
			}

			50% {
				transform: translateX(-10px) rotate(-1deg);
			}

			75% {
				transform: translateX(10px) rotate(1deg);
			}

			100% {
				transform: translateX(0) rotate(0);
			}
		}

		animation: shake 200ms;
	}

	button {
		width: calc(min(400px, 97%) - 0.5rem);
		margin: 1rem;
		aspect-ratio: 1;
		border: none;
		cursor: pointer;
		padding: 0;
		position: relative;

		font-family: "ubuntu";
		color: rgba(0, 0, 0, 0.171);
		font-size: 5em;
		line-height: 1em;
		// text-shadow: 2px 2px 2px #ccc4b2, -2px -2px 2px #fffae2;
		overflow-wrap: break-word;
		overflow: clip;

		@include tan-button();

		transition: color 400ms;
	}

	.progress {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.2);

		transition: background-color 100ms;

		&[data-progress="0"] {
			background-color: transparent;
		}
	}

	button.ready {
		color: black;
	}
</style>
