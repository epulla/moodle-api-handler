<script lang="ts">
	import Header from '$lib/components/app/header/Header.svelte';
	import Aside from '$lib/components/app/aside/Aside.svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth, db } from '$lib/firebase';
	import { user, userDoc } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { doc, onSnapshot, setDoc } from 'firebase/firestore';
	import type { UserDoc } from '$lib/types';
	import { isMenuOpen } from '$lib/stores/header';

	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (authUser) => {
			$user = authUser;
			if (!$user) {
				goto('/auth/login');
			}
		});
		return unsubscribe;
	});

	let unsubscribe: any;
	$: if ($user && !unsubscribe) {
		unsubscribe = onSnapshot(doc(db, 'users', $user.uid), (userSnapshot) => {
			if (userSnapshot.exists()) {
				const userData = userSnapshot.data();
				$userDoc = {
					uid: $user!.uid,
					...userData
				} as UserDoc;
			} else {
				setDoc(doc(db, `users`, $user!.uid), {
					email: $user!.email,
					functions: []
				});
			}
		});
	}

	$: openMenuClass = $isMenuOpen ? 'active' : '';

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>

<div id="app" class="relative h-screen grid overflow-hidden">
	<header class="[grid-area:header]">
		<Header></Header>
	</header>
	<aside id="menu" class="[grid-area:aside] bg-slate-100 py-5 overflow-auto {openMenuClass}">
		<Aside></Aside>
	</aside>
	<main class="[grid-area:main] w-full max-w-3xl mx-auto px-6 pt-9 overflow-auto">
		<slot />
	</main>
</div>

<!-- <slot /> -->

<style lang="postcss">
	#app {
		grid-template-areas:
			'header header header'
			'aside main main'
			'aside main main';
		grid-template-columns: 200px auto;
		grid-template-rows: 50px auto;
	}

	@media (max-width: 640px) {
		#app {
			grid-template-areas:
				'header header header'
				'aside aside aside'
				'main main main'
				'main main main';
			/* grid-template-columns: 200px auto; */
			grid-template-rows: 50px auto;
		}

		#menu {
			height: 0;
			padding-top: 0;
			padding-bottom: 0;
		}

		#menu.active {
			height: 100%;
			padding-top: 1.25rem;
			padding-bottom: 1.25rem;
		}
	}
</style>
