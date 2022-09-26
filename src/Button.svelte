<script lang="ts">
	let clicksLeft = 10;
	let shake = true;

	let timeout;

	const handleClick = () => {
		if (clicksLeft > 0) {
			clicksLeft--;

			timeout = setTimeout(() => {
				clearTimeout(timeout);
			}, 100);

			// send click to server...
		}
	};
</script>

<button
	class:timeout={clicksLeft === 0}
	on:click={handleClick}
	class:shake
	on:mousedown={() => {
		shake = false;
		setTimeout(() => {
			shake = true;
		}, 1);
	}}
>
	<span>
		{clicksLeft.toLocaleString()}
	</span>
</button>

{#if clicksLeft === 0}
	<p>no more clicks left for today</p>
{/if}

<style lang="scss">
	$rad: 7px;
	$blur: 14px;

	@mixin tan-button {
		color: black;
		border-radius: 15%;
		background: #e8dfca;
		box-shadow: $rad $rad $blur #ccc4b2,
			calc(-1 * $rad) calc(-1 * $rad) $blur #fffae2,
			inset $rad $rad $blur transparent,
			inset calc(-1 * $rad) calc(-1 * $rad) $blur transparent;

		&:active {
			color: black;
			border-radius: 15%;
			background: #e8dfca;
			box-shadow: $rad $rad $blur transparent,
				calc(-1 * $rad) calc(-1 * $rad) $blur transparent,
				inset $rad $rad $blur #ccc4b2,
				inset calc(-1 * $rad) calc(-1 * $rad) $blur #fffae2;
		}
	}

	@mixin red-button {
		color: white !important;
		border-radius: 15%;
		background: #da2f2f;
		box-shadow: $rad $rad $blur #ccc4b2,
			calc(-1 * $rad) calc(-1 * $rad) $blur #fffae2,
			inset $rad $rad $blur transparent,
			inset calc(-1 * $rad) calc(-1 * $rad) $blur transparent;

		/* &:active {
			color: white !important;
			border-radius: 15%;
			background: #da2f2f;
			box-shadow: $rad $rad $blur transparent,
				calc(-1 * $rad) calc(-1 * $rad) $blur transparent,
				inset $rad $rad $blur #c02929,
				inset calc(-1 * $rad) calc(-1 * $rad) $blur #f43535;
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

		font-family: "ubuntu";
		font-size: 5em;
		line-height: 1em;
		overflow-wrap: break-word;

		@include tan-button();

		transition: box-shadow 0ms cubic-bezier(0, 0.7, 0, 1);
	}
</style>
