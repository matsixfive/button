<script lang="ts">
	import Button from "./Button.svelte";
	import WinCounter from "./WinCounter.svelte";

	let flash = false;
</script>

<main class:flash>
	<div class="win-container">
		<WinCounter />
	</div>

	<Button bind:flash />
</main>

<style lang="scss">
	main {
		text-align: center;
		min-height: 100vh;
		margin: 0 auto;
		background: #e8dfca;

		transition: background-color 100ms ease-in-out;

		&.flash {
			background: #aebdca;
		}
	}

	.win-container {
		position: absolute;
		top: 1em;
		right: 1em;
		z-index: 1;
	}
</style>
