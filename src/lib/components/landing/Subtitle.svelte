<script lang="ts">
	export let type = 'h2';
</script>

{#if type === 'h2'}
	<h2 class="text-black text-xl sm:text-2xl">
		<slot />
	</h2>
{:else if type === 'h3'}
	<h3 class="text-black text-lg sm:text-xl">
		<slot />
	</h3>
{:else}
	<h4 class="text-black text-base sm:text-lg">
		<slot />
	</h4>
{/if}
