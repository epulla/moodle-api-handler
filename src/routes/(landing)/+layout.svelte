<script>
	import LandingHeader from '$lib/components/landing/LandingHeader.svelte';
</script>

<div id="landing" class="relative h-screen grid overflow-hidden">
	<header class="[grid-area:header]"><LandingHeader></LandingHeader></header>
	<main class="[grid-area:main]">
		<slot />
	</main>
</div>

<style lang="postcss">
	#landing {
		grid-template-areas:
			'header header header'
			'main main main'
			'main main main';
		grid-template-columns: 200px auto;
		grid-template-rows: 50px auto;
	}
</style>
