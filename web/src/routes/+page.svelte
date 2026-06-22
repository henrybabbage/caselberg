<script lang="ts">
	import { useQuery } from '@sanity/sveltekit';
	import { mapSlides } from '$lib/clients-page';
	import CascadingSlider from '$lib/components/cascading-slider.svelte';
	import type { CascadingSlide } from '$lib/types/cascading';
	import type { ClientsPage } from '$lib/types/sanity';

	let { data } = $props<{
		data: {
			clientsPage: ClientsPage | null;
			query: string;
			options: { initial: unknown };
			slides: CascadingSlide[];
		};
	}>();

	// svelte-ignore state_referenced_locally
	const query = useQuery<ClientsPage | null>({
		query: data.query,
		options: data.options
	});
	const clientsPage = $derived($query.data ?? data.clientsPage);
	const slides = $derived(mapSlides(clientsPage?.slides));
	const displaySlides = $derived(slides.length ? slides : data.slides);
</script>

<svelte:head>
	<title>Caselberg Studio</title>
</svelte:head>

<div
	class="mx-auto flex w-full min-h-full max-w-6xl flex-col justify-start pt-4"
>
	<h1 class="sr-only">Home</h1>

	{#if displaySlides.length}
		<div class="flex min-h-0 min-w-0 flex-1 flex-col justify-center">
			<CascadingSlider
				slides={displaySlides}
				ariaLabel={clientsPage?.carouselLabel}
				fitViewport
			/>
		</div>
	{:else}
		<p class="rounded border border-black bg-white p-4 text-sm text-black">
			Add work slides in Sanity and assign them to the Clients page carousel.
		</p>
	{/if}
</div>
