<script lang="ts">
	import { initCascadingSlider } from '$lib/cascading-slider/init-cascading-slider';
	import type { CascadingSlide } from '$lib/types/cascading';

	import './cascading-slider.css';

	type Props = {
		slides: CascadingSlide[];
		ariaLabel?: string;
		/** Constrain slide rail height to viewport (use on /clients with non-scrolling shell). */
		fitViewport?: boolean;
	};

	let { slides, ariaLabel = 'Featured work', fitViewport = false }: Props = $props();

	let wrap: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!wrap || slides.length === 0) return;
		const root = wrap;
		const done = initCascadingSlider(root);
		return () => done();
	});
</script>

{#if slides.length}
	<div
		bind:this={wrap}
		data-cascading-slider-wrap
		class="cascading-slider"
		class:cascading-slider--fit-viewport={fitViewport}
		aria-label={ariaLabel}
		aria-roledescription="carousel"
	>
		<div class="cascading-slider__collection">
			<div data-cascading-viewport class="cascading-slider__list">
				{#each slides as slide (slide.id)}
					<div
						aria-roledescription="slide"
						data-cascading-slide
						role="group"
						class="cascading-slider__item"
						data-slide-title={slide.title}
						data-slide-description={slide.description}
					>
						<div class="cascading-slider__item-inner">
							<div class="cascading-slider__item-bg">
								{#if slide.srcMobile || slide.srcTablet}
									<picture>
										{#if slide.srcMobile}
											<source media="(max-width: 479px)" srcset={slide.srcMobile} />
										{/if}
										{#if slide.srcTablet}
											<source media="(max-width: 767px)" srcset={slide.srcTablet} />
										{/if}
										<img
											src={slide.src}
											alt=""
											loading="eager"
											draggable="false"
											class="cascading-slider__img"
										/>
									</picture>
								{:else}
									<img
										src={slide.src}
										alt=""
										loading="eager"
										draggable="false"
										class="cascading-slider__img"
									/>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div data-cascading-caption class="cascading-slider__caption">
			<span data-cascading-title class="cascading-slider__title"></span>
			<span data-cascading-description class="cascading-slider__description"></span>
		</div>

		<nav aria-label="Slider navigation" class="cascading-slider__nav">
			<button
				type="button"
				data-cascading-slider-prev
				aria-label="Previous slide"
				class="cascading-slider__button cascading-slider__button--prev"
			>
				<img
					src="/carousel/arrow-left.svg"
					alt=""
					width="24"
					height="24"
					draggable="false"
					class="cascading-slider__button-icon"
				/>
			</button>
			<button
				type="button"
				data-cascading-slider-next
				aria-label="Next slide"
				class="cascading-slider__button cascading-slider__button--next"
			>
				<img
					src="/carousel/arrow-right.svg"
					alt=""
					width="24"
					height="24"
					draggable="false"
					class="cascading-slider__button-icon"
				/>
			</button>
		</nav>
	</div>
{/if}
