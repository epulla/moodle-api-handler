<script lang="ts">
	export let size = 24;
	export let color: string = 'rgb(249 115 22 / var(--tw-bg-opacity))';
	let borderSize = (size * 16) / 120;
</script>

<div
	class="loader"
	style="width: {size}px; height: {size}px; border: {borderSize}px solid #f3f3f3; border-top: {borderSize}px solid {color};"
></div>

<style>
	.loader {
		border-radius: 50%;
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate();
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
