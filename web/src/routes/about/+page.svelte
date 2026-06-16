<script lang="ts">
	import { stegaClean, useQuery } from '@sanity/sveltekit';
	import PortableText from '$lib/components/portable-text.svelte';
	import type { AboutPage } from '$lib/types/sanity';

	let { data } = $props<{
		data: { aboutPage: AboutPage | null; query: string; options: { initial: unknown } };
	}>();

	// svelte-ignore state_referenced_locally
	const query = useQuery<AboutPage | null>({
		query: data.query,
		options: data.options
	});
	const aboutPage = $derived($query.data ?? data.aboutPage);
	const cleanTitle = $derived(aboutPage?.title ? stegaClean(aboutPage.title) : undefined);
</script>

<svelte:head>
	<title>{cleanTitle ? `${cleanTitle} — Caselberg Studio` : 'About — Caselberg Studio'}</title>
</svelte:head>

{#if aboutPage?.title}
	<h1 class="sr-only">{aboutPage.title}</h1>
{/if}

<div
	class="flex h-full w-full flex-col items-center justify-center"
>
	<div
		class="about-main-text w-fit max-w-[72ch] text-left text-[0.8767rem] leading-[1.4] text-[#0a0a0a] [&_p]:m-0 [&_p+p]:mt-4"
	>
		<PortableText value={aboutPage?.body} class="!text-left !leading-[1.4]" />
	</div>
</div>
