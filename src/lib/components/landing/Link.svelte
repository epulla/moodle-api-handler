<script lang="ts">
	export let href = '#';
	export let target_blank = false;
</script>

<a {href} target={target_blank ? '_blank' : ''} class="underline text-orange-400">
	<slot />
</a>
