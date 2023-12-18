<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FormBtn from '$lib/components/FormBtn.svelte';
	import Title from '$lib/components/app/main/Title.svelte';
	import { FUNCTION_ID_NAME_SEPARATOR } from '$lib/constants';
	import { db } from '$lib/firebase';
	import MinusIcon from '$lib/icons/MinusIcon.svelte';
	import PlusIcon from '$lib/icons/PlusIcon.svelte';
	import { user as userDoc } from '$lib/stores/user';
	import { Toast } from '$lib/toasts';
	import type { MoodleFunctionKey } from '$lib/types';
	import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';

	/* Binding values */
	let functionName = $page.url.searchParams.get('functionName') || '';
	let loading = false;
	// by default, it'd be 1
	let functionKeys: MoodleFunctionKey[] = [
		{
			key: '',
			required: true,
			hint: ''
		}
	];

	const handleSubmit = async () => {
		try {
			loading = true;
			const functionRef = await addDoc(collection(db, 'users', $userDoc!.uid, 'api_functions'), {
				functionName,
				functionKeys
			});
			const functionUrl = `${functionRef.id}${FUNCTION_ID_NAME_SEPARATOR}${functionName}`
			await updateDoc(doc(db, 'users', $userDoc!.uid), {
				functions: arrayUnion(functionUrl)
			});
			loading = false;
			Toast.success(`Function ${functionName} was added!`)
			goto(`/app/function/${functionUrl}`)
			
		} catch (error) {
			console.error(error);
		}
	};
	const addKey = () => {
		functionKeys = [
			...functionKeys,
			{
				key: '',
				required: true,
				hint: ''
			}
		];
	};
	const removeKey = () => {
		if (functionKeys.length == 1) {
			return;
		}
		functionKeys.splice(-1);
		functionKeys = functionKeys;
	};
</script>

<Title>Add API page</Title>
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
	{#each functionKeys as items, i}
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
		</div>
	{/each}
	<div class="flex gap-2">
		<button type="button" on:click={addKey} class="hover:bg-green-300 transition rounded-full"
			><PlusIcon /></button
		>
		<button type="button" on:click={removeKey} class="hover:bg-red-300 transition rounded-full"
			><MinusIcon /></button
		>
	</div>
	<div class="flex justify-center py-3">
		<FormBtn {loading}>Save</FormBtn>
	</div>
</form>
