<script lang="ts">
	import { useQuery } from '@sanity/sveltekit';
	import ContactBlock from '$lib/components/contact-block.svelte';
	import type { ContactPage } from '$lib/types/sanity';

	let { data } = $props<{
		data: { contactPage: ContactPage | null; query: string; options: { initial: unknown } };
	}>();

	// svelte-ignore state_referenced_locally
	const query = useQuery<ContactPage | null>({
		query: data.query,
		options: data.options
	});
	const c = $derived($query.data ?? data.contactPage);
</script>

<svelte:head>
	<title>Contact — Caselberg Studio</title>
</svelte:head>

<div
	class="flex h-full w-full flex-col items-start justify-center"
>
	<h1 class="sr-only">Contact</h1>

	{#if c?.heading && c.email && c.instagramUrl && c.instagramHandle && c.phoneTel && c.phoneDisplay}
		<div class="w-full max-w-lg">
			<ContactBlock
				heading={c.heading}
				email={c.email}
				emailDisplay={c.emailDisplay}
				instagramUrl={c.instagramUrl}
				instagramHandle={c.instagramHandle}
				phoneTel={c.phoneTel}
				phoneDisplay={c.phoneDisplay}
			/>
		</div>
	{:else}
		<div class="w-full max-w-lg">
			<p class="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
				Fill in the Contact singleton in Sanity (<code class="rounded bg-amber-100 px-1">_id: contactPage</code>).
			</p>
		</div>
	{/if}
</div>
