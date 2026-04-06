<script lang="ts">
	import CascadingSlider from '$lib/components/cascading-slider.svelte';
	import type { CascadingSlide } from '$lib/types/cascading';
	import PortableText from '$lib/components/portable-text.svelte';
	import type { ClientsPage } from '$lib/types/sanity';

	let { data } = $props<{
		data: { clientsPage: ClientsPage | null; slides: CascadingSlide[] };
	}>();
</script>

<svelte:head>
	<title>Clients — Caselberg Studio</title>
</svelte:head>

<div class="mx-auto max-w-6xl pt-4">
	<h1 class="sr-only">Clients</h1>
	<div class="mb-10">
		<PortableText value={data.clientsPage?.intro} />
	</div>

	{#if data.slides.length}
		<CascadingSlider slides={data.slides} ariaLabel={data.clientsPage?.carouselLabel} />
	{:else}
		<p class="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
			Add work slides in Sanity and assign them to the Clients page carousel.
		</p>
	{/if}
</div>
