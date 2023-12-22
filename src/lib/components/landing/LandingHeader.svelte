<script lang="ts">
	const headerBarLinks: { title: string; url: string }[] = [
		{ title: 'Home', url: '/' },
		{ title: 'Docs', url: '/docs' },
		{ title: 'Login', url: '/auth/login' }
	];
</script>

<div class="relative flex h-full justify-between items-center px-5 bg-orange-500 shadow-xl">
	<h1 class="text-white">Moodle API Handle</h1>
	<!-- <button class="text-white rounded-full p-2 hover:bg-orange-600 transition"
		><HamburgerIcon></HamburgerIcon></button
	> -->
	<ul class="flex h-full text-white">
		{#each headerBarLinks as item, i}
			<li>
				<a href={item.url} class="hover:bg-orange-600 transition h-full px-4 flex items-center"
					>{item.title}</a
				>
			</li>
		{/each}
	</ul>
</div>
