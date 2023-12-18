<script lang="ts">
	import Loader from '$lib/components/Loader.svelte';
	import { FUNCTION_ID_NAME_SEPARATOR } from '$lib/constants';
	import { userDoc } from '$lib/stores/user';

	let functionsIdAndName: any[] = [];
	$: if ($userDoc) {
		functionsIdAndName = $userDoc.functions || [];
	}
</script>

<div class="flex flex-col h-full justify-between">
	<ul class="flex flex-col gap-4">
		<li>
			<a href="/app" class="flex w-full px-5 py-2 hover:bg-slate-400 transition">Home</a>
		</li>
		{#if $userDoc}
			{#each functionsIdAndName as item}
				<li>
					<a href="/app/function/{item}" class="flex w-full px-5 py-2 hover:bg-slate-400 transition"
						>{item.split(FUNCTION_ID_NAME_SEPARATOR)[1]}</a
					>
				</li>
			{/each}
		{:else}
			<li>
				<div class="flex w-full px-5 py-2">
					<Loader />
				</div>
			</li>
		{/if}
		<li class="flex">
			<a
				href="/app/function/add"
				class="w-full flex justify-center bg-orange-500 mx-5 py-2 rounded text-white relative shadow hover:bg-orange-600 transition"
				>Add +</a
			>
		</li>
	</ul>
	<ul class="flex flex-col">
		<li>
			<a href="/app/config" class="flex w-full px-5 py-2 hover:bg-slate-400 transition">Config</a>
		</li>
	</ul>
</div>
