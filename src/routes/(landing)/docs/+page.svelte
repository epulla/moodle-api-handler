<script lang="ts">
	import Title from '$lib/components/landing/Title.svelte';
	import Subtitle from '$lib/components/landing/Subtitle.svelte';
	import NumberedList from '$lib/components/landing/NumberedList.svelte';
	import NumberedListItem from '$lib/components/landing/NumberedListItem.svelte';
	import Link from '$lib/components/landing/Link.svelte';
	import LightText from '$lib/components/landing/LightText.svelte';
	import ArrowLeftIcon from '$lib/icons/ArrowLeftIcon.svelte';
	import Image from '$lib/components/landing/Image.svelte';
</script>

<div class="max-w-3xl w-full mx-auto pt-7 flex flex-col gap-3 overflow-y-auto">
	<Title>Instructions</Title>
	<span class="block w-full border-t border-gray-400"></span>
	<NumberedList>
		<NumberedListItem>
			<Link href="/auth/login" target_blank>Log in to the app</Link>
		</NumberedListItem>
		<NumberedListItem>
			Go to your <Link href="/app/config" target_blank>Config Page</Link> from the side menu:
			<Image src="instructions/config_side_menu.png" alt="Config Side Menu"></Image>
		</NumberedListItem>
		<NumberedListItem>
			Add your configuration and <strong>save</strong> it:
			<br />
			- Moodle Host: <LightText>(e.g. https://mymoodle.com)</LightText>
			<br />
			- Moodle Token: <LightText>(e.g. abc123456789)</LightText>
			<br />
			<Image src="instructions/config_page.png" alt="Config Page"></Image>
			If you need more info about how to get your Moodle Token, please refer to <Link
				href="https://supportus.moodle.com/support/solutions/articles/80001016973-using-the-web-services-application-programming-interface-api-in-moodle"
				target_blank>this page.</Link
			>
		</NumberedListItem>
		<NumberedListItem>
			Click on
			<a
				href="/app/function/add"
				class="justify-center bg-orange-500 px-5 py-2 rounded text-white relative shadow hover:bg-orange-600 transition"
				>Add +</a
			>
			to add a <Link href="https://docs.moodle.org/dev/Web_service_API_functions"
				>Moodle Function</Link
			> :
			<span class="block pt-2">
				<Image src="/instructions/add_function_btn.png" alt="Function Add Button"></Image>
			</span>
		</NumberedListItem>
		<NumberedListItem>
			Add the <strong>name</strong> of the function, its <strong>required fields</strong> and any
			<strong>optional hint</strong>:
			<Image src="/instructions/add_function_page.png" alt="Add Function Page"></Image>
			and finally <strong>save</strong> it.
		</NumberedListItem>
		<NumberedListItem>
			Go to your recently created Moodle Function page (it will appear on your side menu):
			<Image src="/instructions/function_btn.png"></Image>
		</NumberedListItem>
		<NumberedListItem
			>Add values to your recently added fields and click on
			<button
				class="justify-center bg-orange-500 w-[150px] px-5 py-2 rounded text-white relative shadow hover:bg-orange-600 transition"
				>Send request</button
			>
			and watch your results at the <strong>Response</strong> section below:
			<Image src="/instructions/function_page.png" alt="Function Page"></Image>
			<div class="w-full bg-slate-100 p-5 my-2 rounded shadow">
				<strong class="text-orange-600">IMPORTANT NOTE:</strong> You can edit, share or delete your function
			</div>
		</NumberedListItem>
	</NumberedList>
</div>
