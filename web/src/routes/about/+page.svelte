<script lang="ts">
	import PortableText from '$lib/components/portable-text.svelte';
	import type { AboutPage } from '$lib/types/sanity';

	let { data } = $props<{ data: { aboutPage: AboutPage | null } }>();
</script>

<svelte:head>
	<title>{data.aboutPage?.title ? `${data.aboutPage.title} — Caselberg Studio` : 'About — Caselberg Studio'}</title>
</svelte:head>

{#if data.aboutPage?.title}
	<h1 class="sr-only">{data.aboutPage.title}</h1>
{/if}

<div
	class="flex w-full min-h-[calc(100vh-12rem)] flex-col items-center justify-center sm:min-h-[calc(100vh-10rem)]"
>
	<div
		class="about-main-text w-fit max-w-[72ch] text-left text-[0.8767rem] leading-[1.4] text-[#0a0a0a] [&_p]:m-0 [&_p+p]:mt-4"
	>
		<PortableText value={data.aboutPage?.body} class="!text-left !leading-[1.4]" />
	</div>
</div>
