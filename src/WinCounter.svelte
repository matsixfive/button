<script lang="ts">
	import { wins } from "./stores/wins";
</script>

<div class="inline">
	<div class="circle">
		<span class="win-count">{$wins}</span>
	</div>
</div>

<style lang="scss">
	.circle {
		border-radius: max(100vh, 100vw);
		background-color: #e82c0e;
		display: flex;
		min-width: calc(2em - 12px);
		min-height: 2em;
		align-items: center;
		justify-content: center;
		padding: 0 6px 0 6px;
	}
	
	.win-count {
		color: white;
		font-family: "ubuntu";
		font-weight: bold;
		margin-bottom: 0.1em;
	}
	
	.inline {
		display: inline-block;
	}
</style>
