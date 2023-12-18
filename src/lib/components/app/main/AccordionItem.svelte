<script lang="ts">
	import ArrowDownIcon from '$lib/icons/ArrowDownIcon.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let isOpen = false;
	$: isOpenClass = isOpen ? 'is-open' : '';

	const onClick = () => {
		dispatch('click');
	};
</script>

<button
	on:click={() => {
		isOpen = !isOpen;
		onClick();
	}}
	class="w-full p-3 rounded text-xl border bg-slate-100 shadow-md {isOpenClass}"
>
	<div class="flex justify-between items-center">
		<slot name="title" />
		<div class="arrow-icon">
			<ArrowDownIcon />
		</div>
	</div>
</button>
<p class="content text-base p-3 border transition-all overflow-hidden {isOpenClass}">
	<slot name="content" />
</p>

<style>
	p {
		height: 0;
		opacity: 0;
		z-index: -999;
	}

	p.is-open {
		height: 250px;
		overflow: auto;
		opacity: 1;
		z-index: auto;
	}

	button .arrow-icon {
		transform: rotateZ(0deg);
		transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	button.is-open .arrow-icon {
		transform: rotateZ(180deg);
	}
</style>
