<script lang="ts">
	export let value: string | undefined | unknown = '';
	export let id: string = "";
	export let name: string = "";
	export let required = false;
	export let maxlength = 100;
	export let placeholder = '';
	export let disabled = false;
</script>

<input
	bind:value
	class="border-slate-400 border rounded px-1"
	type="text"
	{id}
	{name}
	{placeholder}
	{maxlength}
	{required}
	{disabled}
/>
