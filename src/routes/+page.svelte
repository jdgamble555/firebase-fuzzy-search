<script lang="ts">
	import Loading from './loading.svelte';
	import { applyAction, enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let loading = false;

	export let form: ActionData;
</script>

<main class="mt-10 flex flex-col items-center justify-center gap-5">
	<h1 class="text-3xl font-semibold">Firestore Fuzzy Full-Text Example</h1>
	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				await applyAction(result);
			};
		}}
		action="?/searchPosts"
	>
		<div class="flex w-72 gap-3">
			<input
				type="text"
				name="text"
				class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				placeholder="Search text..."
				required
			/>
			<button class="rounded-lg border bg-orange-600 p-3 font-semibold text-white" type="submit">
				Go!
			</button>
		</div>
	</form>
</main>
{#if loading}
	<Loading />
{:else if form?.docs.length}
	<div class="mt-5 flex flex-col items-center justify-center gap-5">
		<div class="max-w-5xl">
			{#each form?.docs || [] as doc}
				<div class="border p-5">
					{doc.text}
				</div>
			{/each}
		</div>
	</div>
{/if}
