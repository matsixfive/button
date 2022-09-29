<script lang="ts">
	import { ready, cooldown } from "./stores/ready";
	import { clicksLeft } from "./stores/clicksLeft";
	import { wins } from "./stores/wins";

	let shake = true;
	export let flash = false;
	let progress = 0;

	let confirmed = true;

	const recievedConfirmation = () => {
		confirmed = true;

		$clicksLeft--;

		ready.set(Date.now() + cooldown);

		updateProgress();
		newClick();
	};

	const bezier = (t: number) => {
		// https://www.desmos.com/calculator/ebdtbxgbq0

		const v2 = 0;
		const c2 = 0.5;
		const v3 = 1;
		const c3 = 0.5;

		// const y_1 = (t: number) =>
		// 	1 - (((t - t ** 3) / (3 * t) - t * v3) / v2) ** (1 / 2);

		// const t_1 = t;
		// t = y_1(t);

		const x = 3 * t * (1 - t) ** 2 * c2 + 3 * t ** 2 * (1 - t) * c3 + t ** 3;
		const y = 3 * t * (1 - t) ** 2 * v2 + 3 * t ** 2 * (1 - t) * v3 + t ** 3;

		// console.log(t_1, x, t);

		// console.log(y)
		return x;
	};

	const updateProgress = () => {
		const progressInterval = setInterval(() => {
			progress = 100 - bezier(1 - ($ready - Date.now()) / cooldown) * 100;
			progress = Number(progress.toFixed(2)); //truncate to 2 d.p

			if ($ready - Date.now() < 0) {
				clearInterval(progressInterval);
				progress = Math.min(Math.max(progress, 0), 100); // clamp between 0 and 100
			}
		}, 16); //60fps
	};

	updateProgress();

	const newClick = () => {
		flash = true;

		setTimeout(() => {
			flash = false;
		}, 200);
	};

	const handleClick = () => {
		// shake button
		if ($clicksLeft === 0) {
			shake = false;
			setTimeout(() => {
				shake = true;
			}, 1);
		}

		if ($clicksLeft > 0 && $ready <= Date.now() && confirmed) {
			// send click to server...
			socket.send("add");
			confirmed = false;
		} else {
			console.log("not ready");
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

		switch (message.data) {
			case "new":
				newClick();
				break;
			case "win":
				$wins += 1;
				break;
			case "recieved":
				recievedConfirmation();
				break;
			default:
				console.error("ws error?!", message.data);
				break;
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
	class:ready={progress === 0 && confirmed === true}
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
		// margin: 1rem;
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
