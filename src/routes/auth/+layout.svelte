<script lang="ts">
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (authUser) => {
			$user = authUser;
			if ($user) {
				goto('/app');
			}
		});
		return unsubscribe;
	});
</script>

<div class="relative overflow-hidden h-screen flex justify-center items-center">
	<slot />
</div>
