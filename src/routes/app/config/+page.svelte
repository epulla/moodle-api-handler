<script lang="ts">
	import FormBtn from '$lib/components/app/main/FormBtn.svelte';
	import FormInput from '$lib/components/app/main/FormInput.svelte';
	import Title from '$lib/components/app/main/Title.svelte';
	import { db } from '$lib/firebase';
	import { user, userDoc } from '$lib/stores/user';
	import { Toast } from '$lib/toasts';
	import { doc, setDoc } from 'firebase/firestore';

	let appConfig = {
		host: '',
		token: '',
		updated: ''
	};
	let loading = false;

	$: if ($userDoc) {
		appConfig = $userDoc.config || {
			host: '',
			token: '',
			updated: ''
		};
	}
	const handleSubmit = async () => {
		try {
			/* Use an specific ID */
			// const docRef = doc(db, 'users', $user!.uid, "configs", "customID");
			// setDoc(docRef, {
			// 	...appConfig,
			// 	created: new Date().toISOString()
			// });
			/* Let firestore to set an automatic id */
			/* Add subcollection to users */
			// option 1
			// const docRef = doc(db, 'users', $user!.uid);
			// const colRef = collection(docRef, 'config');
			// await addDoc(colRef, {
			// 	...appConfig,
			// 	created: new Date().toISOString()
			// });
			// option 2
			// const usersRef = collection(db, 'users')
			// await addDoc(collection(usersRef, $user!.uid, 'config'), {
			// 	name: ''
			// })
			loading = true;
			await setDoc(
				doc(db, 'users', $user!.uid),
				{
					config: {
						...appConfig,
						updated: new Date().toISOString()
					}
				},
				{ merge: true }
			);
			loading = false;
			Toast.success('Config saved!');
		} catch (error) {
			Toast.error('An error has occurred');
			console.error(error);
		}
	};
</script>

<Title>
	Configuration
	<p class="opacity-50 text-base">
		{#if appConfig.updated !== ''}
			Last Updated: {new Date(appConfig.updated).toLocaleString()}
		{:else}
			Last Updated: No updates
		{/if}
	</p>
</Title>
<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-2" action="">
	<label for="host">Host:</label>
	<FormInput bind:value={appConfig.host} id="host" name="host" required />
	<label for="token">Token:</label>
	<FormInput bind:value={appConfig.token} id="token" name="token" required />
	<div class="flex justify-center py-3">
		<FormBtn {loading}>Save</FormBtn>
	</div>
</form>
