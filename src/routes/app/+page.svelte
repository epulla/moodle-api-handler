<script lang="ts">
	import Loader from '$lib/components/Loader.svelte';
	import { user } from '$lib/stores/user';
</script>

<div class="flex flex-col gap-4 h-full w-full justify-center items-center">
	{#if $user}
		<img
			id="user-img"
			class="w-[100px] h-[100px] rounded-full"
			referrerpolicy="no-referrer"
			src={$user?.photoURL}
			alt={$user?.displayName}
		/>
		<h1 class="text-3xl">
			Hello {$user.displayName}!
		</h1>
		<h2 class="text-lg opacity-50">
			{$user.email}
		</h2>
	{:else}
		<Loader color="rgb(249 115 22)"/>
	{/if}
</div>
