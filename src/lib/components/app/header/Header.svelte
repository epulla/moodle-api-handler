<script lang="ts">
	import { goto } from '$app/navigation';
	import Loader from '$lib/components/Loader.svelte';
	import HamburgerIcon from '$lib/icons/HamburgerIcon.svelte';
	import { auth } from '$lib/firebase';
	import { user, userDoc } from '$lib/stores/user';
	import { signOut } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { isMenuOpen } from '$lib/stores/header';

	let isUserMenuToggled = false;
	$: isOpenClass = isUserMenuToggled ? 'is-open' : '';

	const logOut = async () => {
		try {
			await signOut(auth);
			$user = null;
			$userDoc = null;
			goto('/');
		} catch (error) {
			console.error(error);
		}
	};

	onMount(() => {
		document.addEventListener('click', (event) => {
			const targetId = (event.target as HTMLElement).id;
			if (targetId !== 'user-img' && targetId !== 'user-btn' && isUserMenuToggled) {
				isUserMenuToggled = false;
			}
		});
	});
</script>

<div class="relative flex h-full justify-between items-center px-5 bg-orange-500 shadow-xl">
	<div class="flex items-center">
		<button class="sm:hidden text-white" on:click={() => ($isMenuOpen = !$isMenuOpen)}>
			<HamburgerIcon></HamburgerIcon>
		</button>
	</div>
	<div class="relative flex justify-center items-center text-white h-full">
		<a href="/app/docs" class="hover:bg-orange-600 transition h-full px-4 flex items-center">Docs</a>
		<button
			id="user-btn"
			class="hover:bg-[#0002] p-1 rounded-full transition"
			on:click={() => (isUserMenuToggled = !isUserMenuToggled)}
		>
			{#if $user}
				<img
					id="user-img"
					class="w-[24px] h-[24px] rounded-full"
					referrerpolicy="no-referrer"
					src={$user?.photoURL}
					alt={$user?.displayName}
				/>
			{:else}
				<Loader />
			{/if}
		</button>
		<div
			id="user-menu"
			class="{isOpenClass} absolute overflow-hidden whitespace-nowrap flex flex-col top-7 right-1 bg-slate-200 rounded shadow"
		>
			<button on:click={logOut} class="hover:bg-white px-3 py-2 rounded transition text-left"
				>Log out</button
			>
		</div>
	</div>
</div>

<style>
	#user-menu {
		opacity: 0;
		width: 0;
		transition: all 0.5s ease-in-out;
	}
	#user-menu.is-open {
		width: 150px;
		opacity: 1;
	}
</style>
