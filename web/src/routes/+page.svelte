<script lang="ts">
	import CascadingSlider from '$lib/components/cascading-slider.svelte';
	import type { CascadingSlide } from '$lib/types/cascading';
	import type { ClientsPage } from '$lib/types/sanity';

	let { data } = $props<{
		data: { clientsPage: ClientsPage | null; slides: CascadingSlide[] };
	}>();
</script>

<svelte:head>
	<title>Caselberg Studio</title>
</svelte:head>

<div
	class="mx-auto flex w-full min-h-full max-w-6xl flex-col justify-start pt-4"
>
	<h1
		class="{data.clientsPage?.title
			? 'mb-4 shrink-0 text-[0.8767rem] font-normal text-[#0a0a0a]'
			: 'sr-only'}"
	>
		{data.clientsPage?.title ?? 'Clients'}
	</h1>

	{#if data.slides.length}
		<div class="flex min-h-0 min-w-0 flex-1 flex-col justify-center">
			<CascadingSlider
				slides={data.slides}
				ariaLabel={data.clientsPage?.carouselLabel}
				fitViewport
			/>
		</div>
	{:else}
		<p class="rounded border border-black bg-white p-4 text-sm text-black">
			Add work slides in Sanity and assign them to the Clients page carousel.
		</p>
	{/if}
</div>
