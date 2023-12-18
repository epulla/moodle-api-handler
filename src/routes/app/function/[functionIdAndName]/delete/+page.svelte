<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FormBtn from '$lib/components/FormBtn.svelte';
	import Title from '$lib/components/app/main/Title.svelte';
	import { db, storage } from '$lib/firebase';
	import { userDoc } from '$lib/stores/user';
	import { Toast } from '$lib/toasts';
	import type { MoodleHistoryItem } from '$lib/types';
	import { extractFunctionIdAndName } from '$lib/util';
	import { arrayRemove, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
	import { deleteObject, ref } from 'firebase/storage';

	const functionIdAndName = $page.params.functionIdAndName;
	const [functionId, functionName] = extractFunctionIdAndName(functionIdAndName);
	let loading = false;

	const handleDeleteClick = async () => {
		loading = true;
		// delete api function doc and its history files
		const apiFunctionDoc = doc(db, 'users', $userDoc!.uid, 'api_functions', functionId);
		const apiFunctionSnapshot = await getDoc(apiFunctionDoc);
		const apiFunctionHistory = apiFunctionSnapshot.data()?.history ?? [];
		apiFunctionHistory.forEach(async (historyItem: MoodleHistoryItem) => {
			const fileRef = ref(storage, historyItem.storageUrl);
			await deleteObject(fileRef);
		});
		await deleteDoc(apiFunctionDoc);
		// update user doc
		await updateDoc(doc(db, 'users', $userDoc!.uid), {
			functions: arrayRemove(functionIdAndName)
		});

		loading = false;
		Toast.warn(`Function ${functionName} was deleted`);
		goto('/app');
	};
</script>

<Title>Are you sure?</Title>

<h2>You are about to delete the function <strong>{functionName}</strong></h2>
<div class="flex gap-4 mt-5 w-full">
	<FormBtn
		on:click={handleDeleteClick}
		{loading}
		bgColor="rgb(239 68 68)"
		hoverBgColor="rgb(220 38 38)"
		loaderColor="rgb(69 10 10)">Yes</FormBtn
	>
	<a
		class="bg-slate-500 hover:bg-slate-600 p-2 rounded w-[100px] text-center text-white"
		href="/app/function/{functionIdAndName}">Cancel</a
	>
</div>
