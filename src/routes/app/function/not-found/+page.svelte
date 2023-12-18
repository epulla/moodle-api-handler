<script lang="ts">
	import { page } from '$app/stores';

	const functionName = $page.url.searchParams.get('functionName');
</script>

<div class="flex flex-col gap-4 w-full h-full justify-center items-center">
	{#if functionName}
		<h1 class="text-3xl">Your function {functionName} doesn't exist</h1>
		<h2 class="text-2xl underline text-orange-400">
			<a href="/app/function/add?functionName={functionName}">Wanna add it?</a>
		</h2>
	{:else}
    
		<h1 class="text-3xl">No function found</h1>
		<h2 class="text-2xl underline text-orange-400">
			<a href="/app/function/add">Wanna add one?</a>
		</h2>
	{/if}
</div>
