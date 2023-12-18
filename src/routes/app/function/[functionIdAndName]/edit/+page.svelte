<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Loader from '$lib/components/Loader.svelte';
	import FormBtn from '$lib/components/app/main/FormBtn.svelte';
	import Title from '$lib/components/app/main/Title.svelte';
	import { FUNCTION_ID_NAME_SEPARATOR } from '$lib/constants';
	import { db } from '$lib/firebase';
	import PlusIcon from '$lib/icons/PlusIcon.svelte';
	import TrashcanIcon from '$lib/icons/TrashcanIcon.svelte';
	import { userDoc } from '$lib/stores/user';
	import { Toast } from '$lib/toasts';
	import type { MoodleFunction } from '$lib/types';
	import { extractFunctionIdAndName } from '$lib/util';
	import {
		addDoc,
		arrayRemove,
		arrayUnion,
		collection,
		deleteDoc,
		doc,
		onSnapshot,
		setDoc,
		updateDoc
	} from 'firebase/firestore';
	import { onDestroy } from 'svelte';

	const functionIdAndName = $page.params.functionIdAndName;
	const [functionId, originalFunctionName] = extractFunctionIdAndName(functionIdAndName);
	let functionName = originalFunctionName;
	let unsubscribe: any;
	let apiFunction: MoodleFunction = {
		name: originalFunctionName,
		functionKeys: [],
		history: []
	};
	let loading = false;

	$: if ($userDoc && !unsubscribe) {
		if (!$userDoc.functions || !$userDoc.functions.includes(functionIdAndName)) {
			Toast.error(`Function ${functionIdAndName} does not exist`)
			goto(`/app/function/not-found?functionName=${functionIdAndName}`);
		}
		unsubscribe = onSnapshot(
			doc(db, 'users', $userDoc.uid, 'api_functions', functionId),
			(apiFunctionSnapshot) => {
				if (apiFunctionSnapshot.exists()) {
					apiFunction = apiFunctionSnapshot.data() as MoodleFunction;
				}
			}
		);
	}

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});

	const handleSubmit = async () => {
		loading = true;
		let newFunctionIdAndName = functionIdAndName;
		if (functionName === originalFunctionName) {
			await setDoc(doc(db, 'users', $userDoc!.uid, 'api_functions', functionId), {
				...apiFunction
			});
		} else {
			await deleteDoc(doc(db, 'users', $userDoc!.uid, 'api_functions', functionId));
			const functionRef = await addDoc(collection(db, 'users', $userDoc!.uid, 'api_functions'), {
				...apiFunction
			});
			await updateDoc(doc(db, 'users', $userDoc!.uid), {
				functions: arrayRemove(functionIdAndName)
			});
			newFunctionIdAndName = `${functionRef.id}${FUNCTION_ID_NAME_SEPARATOR}${functionName}`;
			await updateDoc(doc(db, 'users', $userDoc!.uid), {
				functions: arrayUnion(newFunctionIdAndName)
			});
		}
		loading = false;
		goto(`/app/function/${newFunctionIdAndName}`);
	};
	const addKey = () => {
		apiFunction.functionKeys = [
			...apiFunction.functionKeys,
			{
				key: '',
				required: true,
				hint: ''
			}
		];
	};
	const removeKey = (i: number) => {
		apiFunction.functionKeys.splice(i, 1);
		apiFunction = apiFunction
	};
</script>

<Title>Edit: {functionName}</Title>
{#if apiFunction.functionKeys.length === 0}
	<div class="h-full w-full flex justify-center items-center">
		<Loader size={48} color="rgb(249 115 22)" />
	</div>
{:else}
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
		<input
			bind:value={functionName}
			class="border-black border rounded px-1"
			type="text"
			id="function"
			name="function"
			placeholder="Function name"
			required
		/>
		{#each apiFunction.functionKeys as items, i}
			<div class="flex flex-col gap-2 border-b border-b-slate-400 pb-4">
				<label for="key_{i + 1}">Key {i + 1}:</label>
				<input
					bind:value={items.key}
					class="border-black border rounded px-1"
					type="text"
					id="key_name_{i + 1}"
					name="key_name_{i + 1}"
					placeholder="Key name"
					required
				/>
				<input
					bind:value={items.hint}
					class="border-black border rounded px-1"
					type="text"
					id="hint_{i + 1}"
					name="hint_{i + 1}"
					placeholder="Write a hint for the value"
				/>
				<label for="required_{i}" class="flex items-center gap-3">
					Required
					<input
						bind:checked={items.required}
						type="checkbox"
						name="required_{i}"
						id="required_{i}"
					/>
				</label>
				<div class="flex">
					<button type="button" on:click={() => removeKey(i)}><TrashcanIcon></TrashcanIcon></button>
				</div>
			</div>
		{/each}
		<div class="flex gap-2">
			<button type="button" on:click={addKey} class="hover:bg-green-300 transition rounded-full"
				><PlusIcon /></button
			>
		</div>
		<div class="flex justify-center py-3 gap-4">
			<FormBtn {loading}>Save</FormBtn>
			<a
				href="/app/function/{functionIdAndName}"
				class="bg-slate-500 rounded px-3 py-1 text-white w-[100px] flex justify-center">Cancel</a
			>
		</div>
	</form>
{/if}
