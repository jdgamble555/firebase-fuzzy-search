<script lang="ts">
	import Loading from '../loading.svelte';
	import { dev } from '$app/environment';
	import { applyAction, enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	let loading = false;

	export let data: PageData;
</script>

<form
	method="POST"
	action="?/addPost"
	use:enhance={() => {
		loading = true;
		return async ({ result, formElement }) => {
			loading = false;
			await invalidateAll();
			await applyAction(result);
			formElement.reset();
		};
	}}
>
	<div class="mt-10 flex flex-col items-center justify-center gap-5">
		<textarea
			name="text"
			class="block w-72 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
			required
			placeholder="Write something..."
			disabled={!dev}
		/>
		<button
			type="submit"
			class="w-fit rounded-lg border bg-orange-600 p-3 font-semibold text-white"
			disabled={!dev}
		>
			Save
		</button>
	</div>
</form>
{#if loading}
	<Loading />
{/if}
{#if !dev}
	<p class="m-5 text-center italic text-red-800">
		I have disabled adding new data for the demo to prevent spam.
	</p>
{/if}
<div class="mt-5 flex flex-col items-center justify-center gap-5">
	<div class="max-w-5xl">
		{#each data?.docs || [] as doc}
			<div class="border p-5">
				{doc.text}
			</div>
		{/each}
	</div>
</div>
