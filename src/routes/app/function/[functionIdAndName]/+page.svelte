<script lang="ts">
	import { userDoc } from '$lib/stores/user';
	import { page } from '$app/stores';
	import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
	import { db, storage } from '$lib/firebase';
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Title from '$lib/components/app/main/Title.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import type { MoodleFunction, MoodleFunctionCall, MoodleHistoryItem } from '$lib/types';
	import { requestMoodle } from '$lib/moodle';
	import FormBtn from '$lib/components/FormBtn.svelte';
	import { createBlobFromMoodleFunctionCall, extractFunctionIdAndName } from '$lib/util';
	import ThreeDotsIcon from '$lib/icons/ThreeDotsIcon.svelte';
	import HistoryIcon from '$lib/icons/HistoryIcon.svelte';
	import { MAX_HISTORY_RECORDS } from '$lib/constants';
	import { Toast } from '$lib/toasts';
	import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

	let previousFunctionIdAndName = $page.params.functionIdAndName; // non-reactive by $page store
	$: functionIdAndName = $page.params.functionIdAndName;
	$: [functionId, functionName] = extractFunctionIdAndName(functionIdAndName || '');
	let apiFunction: MoodleFunction = {
		name: functionName || '',
		functionKeys: [],
		history: []
	};
	let unsubscribe: any;
	let responseString: string = '';
	let pageLoading = false;
	let submitLoading = false;
	let isUserMenuToggled = false;
	$: isOpenClass = isUserMenuToggled ? 'is-open' : '';

	const handleSubmit = async (e: any) => {
		submitLoading = true;
		if (!$userDoc || !$userDoc.config) {
			responseString = 'No config found, please set up a config host and token';
			return;
		}
		const formData = new FormData(e.target);
		const responseObj = await requestMoodle(
			$userDoc.config.host,
			$userDoc.config.token,
			apiFunction.name,
			Object.fromEntries(formData)
		);
		const responseDate = new Date();
		responseString = JSON.stringify(responseObj, null, 2);
		submitLoading = false;

		// upload history file
		const storageRef = ref(storage, `${$userDoc.uid}/history/${responseDate.toISOString()}.json`);
		const call: MoodleFunctionCall = {
			call: Object.fromEntries(formData),
			date: responseDate.toISOString(),
			functionName: apiFunction.name,
			response: responseObj
		};
		const { blob: callBlob, tooLarge } = createBlobFromMoodleFunctionCall(call);
		if (tooLarge) {
			Toast.warn('Response is too large to save');
		}
		const fileSnapshot = await uploadBytes(storageRef, callBlob);
		console.log(`History file ${fileSnapshot.ref.name} has been saved`);

		const history: MoodleHistoryItem = {
			storageUrl: await getDownloadURL(storageRef),
			date: responseDate.toISOString(),
			calledBy: $userDoc.email
		};
		if (apiFunction.history.length < MAX_HISTORY_RECORDS) {
			// save history file download url to firestore
			await updateDoc(doc(db, 'users', $userDoc.uid, 'api_functions', functionId), {
				history: arrayUnion(history)
			});
		} else {
			// delete oldest history file and save current history file download url to firestore
			apiFunction.history.push(history);
			const oldestHistory = apiFunction.history.shift();
			const oldestHistoryFileRef = ref(storage, oldestHistory?.storageUrl);
			deleteObject(oldestHistoryFileRef)
				.then(() => {
					console.log(`Oldest file ${oldestHistory?.storageUrl} has been deleted`);
				})
				.catch((error) => {
					console.error(error);
				});
			await updateDoc(doc(db, 'users', $userDoc.uid, 'api_functions', functionId), {
				history: apiFunction.history
			});
		}
		Toast.success('History Saved!');
	};

	$: if ($userDoc && functionIdAndName) {
		if (!$userDoc.functions || !$userDoc.functions.includes(functionIdAndName)) {
			Toast.error(`Function ${functionName} does not exist`);
			goto(`/app/function/not-found?functionName=${functionName}`);
		}

		if (unsubscribe && previousFunctionIdAndName !== functionIdAndName) {
			pageLoading = true;
			previousFunctionIdAndName = functionIdAndName;
			console.log(`Unsubscribe firestore listener for ${previousFunctionIdAndName}`);
			unsubscribe();
		}

		if (functionId) {
			unsubscribe = onSnapshot(
				doc(db, 'users', $userDoc.uid, 'api_functions', functionId),
				(apiFunctionSnapshot) => {
					if (apiFunctionSnapshot.exists()) {
						apiFunction = {
							name: functionName,
							...apiFunctionSnapshot.data(),
							history: apiFunctionSnapshot.data().history ?? []
						} as MoodleFunction;
						pageLoading = false;
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

<Title>
	<div class="flex justify-between items-center">
		<div class="flex flex-col h-full">
			Function: {functionName}
			<p class="opacity-50 text-base">
				ID: {functionId}
			</p>
		</div>
		<div class="flex h-full gap-1">
			<a
				href="/app/function/{functionIdAndName}/history"
				class="relative rounded-full hover:bg-slate-300 transition p-1"
				><HistoryIcon></HistoryIcon></a
			>
			<button
				id="function-menu-btn"
				on:click={() => (isUserMenuToggled = !isUserMenuToggled)}
				class="relative rounded-full hover:bg-slate-300 transition p-1"
			>
				<ThreeDotsIcon />
				<div
					id="function-menu"
					class="{isOpenClass} absolute whitespace-nowrap flex flex-col top-7 right-1 bg-slate-200 rounded shadow"
				>
					<a
						class="text-base hover:bg-white px-3 py-2 rounded transition text-left"
						href="/app/function/{functionIdAndName}/edit">Edit</a
					>
					<a
						class="text-base hover:bg-white px-3 py-2 rounded transition text-left"
						href="/app/function/{functionIdAndName}/delete">Delete</a
					>
					<a
						class="text-base hover:bg-white px-3 py-2 rounded transition text-left"
						href="/app/function/{functionIdAndName}/share">Share</a
					>
				</div>
			</button>
		</div>
	</div>
</Title>
<form class="flex flex-col gap-2" on:submit|preventDefault={handleSubmit}>
	{#if !pageLoading}
		{#each apiFunction.functionKeys as item, i}
			<label for={item.key}>{item.key}</label>
			<input
				class="border-black border rounded px-1"
				type="text"
				id={item.key}
				name={item.key}
				placeholder={item.hint}
				required={item.required}
			/>
		{:else}
			<div class="flex w-full justify-center">
				<Loader size={48} color="rgb(249 115 22)" />
			</div>
		{/each}
	{:else}
		<div class="flex w-full justify-center">
			<Loader size={48} color="rgb(249 115 22)" />
		</div>
	{/if}
	<div class="flex justify-center py-3">
		<FormBtn width="150px" loading={submitLoading}>Send request →</FormBtn>
	</div>
</form>
<div class="mt-5 flex flex-col w-full">
	<p>Response</p>
	<!-- 
		min-h = 24px [font size] * 5 [line numbers] + (2 * 12px [padding top + padding bottom]) = 144px
		max-h = 24px [font size] * 10 [line numbers] + (2 * 12px [padding top + padding bottom]) = 264px
	-->
	<pre
		class="p-3 bg-slate-200 w-full overflow-auto border border-slate-400 rounded min-h-[144px] max-h-[264px] font-mono">
{responseString}
	</pre>
</div>

<style>
	#function-menu {
		opacity: 0;
		width: 0;
		transition: all 0.5s ease-in-out;
	}
	#function-menu.is-open {
		width: 150px;
		opacity: 1;
	}
</style>
