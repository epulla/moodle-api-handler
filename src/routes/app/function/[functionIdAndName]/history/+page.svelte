<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Loader from '$lib/components/Loader.svelte';
	import AccordionItem from '$lib/components/app/main/AccordionItem.svelte';
	import Accordion from '$lib/components/app/main/Accordion.svelte';
	import Title from '$lib/components/app/main/Title.svelte';
	import { MAX_HISTORY_RECORDS } from '$lib/constants';
	import { db } from '$lib/firebase';
	import { userDoc } from '$lib/stores/user';
	import type { MoodleFunction, MoodleFunctionCall, MoodleHistoryItem } from '$lib/types';
	import { extractFunctionIdAndName } from '$lib/util';
	import { doc, onSnapshot } from 'firebase/firestore';
	import { onDestroy } from 'svelte';
	import FormInput from '$lib/components/app/main/FormInput.svelte';

	const functionIdAndName = $page.params.functionIdAndName;
	const [functionId, functionName] = extractFunctionIdAndName(functionIdAndName);

	let apiFunction: MoodleFunction = {
		name: functionName,
		functionKeys: [],
		history: []
	};
	let loadedHistories: any = {};
	let loading = true;

	const loadHistoryFileContent = async (item: MoodleHistoryItem) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = async (event) => {
			const blob = xhr.response;
			loadedHistories[item.date] = JSON.parse(await blob.text());
			loadedHistories = loadedHistories;
		};
		xhr.open('GET', item.storageUrl);
		xhr.send();
	};

	let unsubscribe: any;
	$: if ($userDoc && !unsubscribe) {
		if (!$userDoc.functions || !$userDoc.functions.includes(functionIdAndName)) {
			goto(`/app/function/not-found?functionName=${functionName}`);
		}

		if (functionId) {
			unsubscribe = onSnapshot(
				doc(db, 'users', $userDoc.uid, 'api_functions', functionId),
				(apiFunctionSnapshot) => {
					if (apiFunctionSnapshot.exists()) {
						apiFunction = {
							name: functionName,
							...apiFunctionSnapshot.data(),
							history: apiFunctionSnapshot.data().history
								? apiFunctionSnapshot
										.data()
										.history.toSorted(
											(a: any, b: any) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
										)
								: []
						} as MoodleFunction;
						loading = false;
					} else {
						goto(`/app/function/not-found?functionName=${functionName}`);
					}
				}
			);
		}
	}

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>

<Title>History: {functionName}</Title>
<a class="flex pb-3 underline text-orange-500" href="/app/function/{functionIdAndName}"
	>{'< Back'}</a
>
{#if loading}
	<div class="flex w-full justify-center">
		<Loader size={48} color="rgb(249 115 22)" />
	</div>
{:else}
	<h2 class="text-xl">Last {MAX_HISTORY_RECORDS} calls: (Newest to Oldest)</h2>
	<Accordion>
		{#each apiFunction.history as item, i}
			<AccordionItem on:click={() => loadHistoryFileContent(item)}>
				<div slot="title" class="text-left">
					<span class="opacity-50 pr-5">{i + 1}</span>
					{item.date.toLocaleString()}
					<span class="text-sm opacity-50">by: {item.calledBy}</span>
				</div>
				<form slot="content" class="flex flex-col">
					{#if loadedHistories[item.date]}
						<!-- content here -->
						<label for="function-name">Function:</label>
						<FormInput
							id="function-name"
							name="function-name"
							value={loadedHistories[item.date].functionName}
							disabled
						/>
						{#each Object.entries(loadedHistories[item.date].call) as [key, value], i}
							<label for={`${key}_${i}`}>{key}:</label>
							<FormInput
								id={`${key}_${i}`}
								name={`${key}_${i}`}
								{value}
								disabled
							/>
						{/each}
						<div class="mt-5 flex flex-col w-full">
							<p>Response</p>
							<pre
								class="p-3 bg-slate-200 w-full overflow-auto border border-slate-400 rounded min-h-[144px] max-h-[264px] font-mono">
{JSON.stringify(loadedHistories[item.date].response, null, 2)}
							 </pre>
						</div>
					{:else}
						<div class="flex w-full h-full justify-center items-center">
							<Loader size={48} color="rgb(249 115 22)" />
						</div>
					{/if}
				</form>
			</AccordionItem>
		{:else}
			<p class="py-3">No history yet!</p>
		{/each}
	</Accordion>
{/if}
