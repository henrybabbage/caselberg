<script lang="ts">
	import { urlForImage } from '$lib/image-url';
	import type { SanityImageSource } from '@sanity/image-url';
	import type { HomePage } from '$lib/types/sanity';

	let { data } = $props<{ data: { homePage: HomePage | null } }>();

	const heroSrc = $derived(
		data.homePage?.heroImage ? urlForImage(data.homePage.heroImage as SanityImageSource) : undefined
	);
</script>

<svelte:head>
	<title>{data.homePage?.title?.trim() ? data.homePage.title : 'Caselberg Studio'}</title>
</svelte:head>

<section class="mx-auto max-w-4xl">
	{#if data.homePage?.title?.trim()}
		<h1 class="text-3xl font-normal tracking-tight text-[#0a0a0a] md:text-4xl">
			{data.homePage.title}
		</h1>
	{/if}
	{#if data.homePage?.subtitle}
		<p class="mt-6 max-w-xl text-sm leading-relaxed text-[#0a0a0a]/80">
			{data.homePage.subtitle}
		</p>
	{/if}
	{#if heroSrc}
		<img
			src={heroSrc}
			alt=""
			class="w-full max-h-[70vh] object-cover {data.homePage?.title?.trim() || data.homePage?.subtitle
				? 'mt-10'
				: ''}"
			loading="lazy"
		/>
	{/if}
</section>
