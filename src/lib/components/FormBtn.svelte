<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Loader from './Loader.svelte';

	export let loading: boolean;
	export let bgColor = 'rgb(249 115 22)';
	export let hoverBgColor = 'rgb(234 88 12)';
	export let textColor = 'white';
	export let width = '100px';

	export let loaderColor = 'rgb(249 115 22)';
	export let loaderSize = 24;

	const dispatch = createEventDispatcher();
	function onClick() {
		dispatch('click');
	}
</script>

<button
	on:click={onClick}
	class="transition rounded px-3 py-1 flex justify-center items-center"
	style="width: {width}; --bgcolor: {bgColor}; --hovercolor:{hoverBgColor}; color: {textColor}"
>
	{#if loading}
		<Loader color={loaderColor} size={loaderSize} />
	{:else}
		<slot />
	{/if}
</button>

<style>
	button {
		background-color: var(--bgcolor);
	}
	button:hover {
		background-color: var(--hovercolor) !important;
	}
</style>
