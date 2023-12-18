<script lang="ts">
	export let value = '';
	export let id: string;
	export let name: string;
	export let required = true;
	export let maxlength = 100;
</script>

<input
	bind:value
	class="border-black border rounded"
	type="text"
	{id}
	{name}
	{maxlength}
	{required}
/>
