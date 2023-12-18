<script lang="ts">
	import Title from '$lib/components/app/main/Title.svelte';
	import { page } from '$app/stores';
	import {
		addDoc,
		arrayUnion,
		collection,
		doc,
		getDoc,
		getDocs,
		query,
		updateDoc,
		where
	} from 'firebase/firestore';
	import { db, storage } from '$lib/firebase';
	import { user, userDoc } from '$lib/stores/user';
	import { extractFunctionIdAndName } from '$lib/util';
	import { FUNCTION_ID_NAME_SEPARATOR } from '$lib/constants';
	import Toastify from 'toastify-js';
	import { Toast } from '$lib/toasts';
	import type { MoodleHistoryItem } from '$lib/types';
	import { getBlob, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	import FormBtn from '$lib/components/app/main/FormBtn.svelte';

	const functionIdAndName = $page.params.functionIdAndName;
	const [functionId, functionName] = extractFunctionIdAndName(functionIdAndName);
	let userEmailToExport: string = '';
	let isShareHistoryChecked = true;
	let loading = false;

	const handleSubmit = async () => {
		if (!userEmailToExport) {
			// toastify bad request, need to add a userToExport
			Toastify({
				text: 'Need to add a userToExport'
			}).showToast();
			console.error('Need to add a userToExport');
			return;
		}
		loading = true;
		const apiFunctionSnapshot = await getDoc(
			doc(db, 'users', $user!.uid, 'api_functions', functionId)
		);

		const q = query(collection(db, 'users'), where('email', '==', userEmailToExport));
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			// toastify not found, user email has to exist
			Toast.error(`User with email ${userEmailToExport} is not found, is the user registered?`);
			console.error(`User with email ${userEmailToExport} is not found, is the user registered?`);
			loading = false;
			return;
		}

		querySnapshot.forEach(async (docSnapshot) => {
			// copy history files
			let apiFunctionHistory = apiFunctionSnapshot.data()?.history ?? [];
			apiFunctionHistory = await Promise.all(
				apiFunctionHistory.map(async (historyItem: MoodleHistoryItem) => {
					const fileRef = ref(storage, historyItem.storageUrl);
					const fileContentBlob = await getBlob(fileRef);
					const storageRef = ref(storage, `${docSnapshot.id}/history/${fileRef.name}`);
					const fileSnapshot = await uploadBytes(storageRef, fileContentBlob);
					console.log(`History file ${fileSnapshot.ref.name} has been saved`);
					const history: MoodleHistoryItem = {
						storageUrl: await getDownloadURL(storageRef),
						date: historyItem.date,
						calledBy: historyItem.calledBy
					};
					return history;
				})
			);

			// add shared function to the other user
			const functionRef = await addDoc(collection(db, 'users', docSnapshot.id, 'api_functions'), {
				functionName,
				...apiFunctionSnapshot.data(),
				history: apiFunctionHistory
			});
			// update the other user's functions menu
			await updateDoc(doc(db, 'users', docSnapshot.id), {
				functions: arrayUnion(`${functionRef.id}${FUNCTION_ID_NAME_SEPARATOR}${functionName}`)
			});
		});

		Toast.success(`Function ${functionName} has been shared to ${userEmailToExport} successfully!`);
		userEmailToExport = '';
		loading = false;
	};
</script>

<Title>Share: {functionName}</Title>
<h2>
	Write down the <strong>email</strong> of the user you want to export/share the function
	<strong>{functionName}</strong> to:
</h2>
<form class="flex flex-col gap-4 mt-5 w-full" on:submit|preventDefault={handleSubmit}>
	<input
		bind:value={userEmailToExport}
		class="border-black border rounded px-1"
		placeholder="user@example.com"
		type="text"
		required
	/>
	<div class="flex gap-4">
		<label for="history-share">Share history?</label>
		<input
			bind:checked={isShareHistoryChecked}
			type="checkbox"
			name="history-share"
			id="history-share"
		/>
	</div>
	<div class="flex gap-4 justify-center">
		<FormBtn
			{loading}
			bgColor="rgb(59 130 246)"
			hoverBgColor="rgb(37 99 235)"
			loaderColor="background-color: rgb(29 78 216)">Export</FormBtn
		>
		<a
			class="bg-slate-500 hover:bg-slate-600 p-2 rounded w-[100px] text-center text-white"
			href="/app/function/{functionIdAndName}">Cancel</a
		>
	</div>
</form>

<style>
	:global(.info) {
		background: blue;
	}
</style>
