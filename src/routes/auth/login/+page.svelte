<script lang="ts">
	import { auth } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import GoogleIcon from '$lib/icons/GoogleIcon.svelte';
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';

	const login = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const res = await signInWithPopup(auth, provider);
			$user = res.user
			goto("/app")
		} catch (error) {
			console.error(error);
		}
	};
</script>

<div class="flex flex-col rounded-xl shadow-xl relative">
	<header class="text-white bg-orange-500 rounded-t-xl p-2 text-xl">Log In</header>
	<div class="p-10">
		<button class="bg-slate-100 p-2 rounded shadow flex gap-2" on:click={login}
			><GoogleIcon />Login with Google</button
		>
	</div>
</div>
