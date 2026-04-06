<script lang="ts">
	import { initCascadingSlider } from '$lib/cascading-slider/init-cascading-slider';
	import type { CascadingSlide } from '$lib/types/cascading';

	import './cascading-slider.css';

	type Props = {
		slides: CascadingSlide[];
		ariaLabel?: string;
	};

	let { slides, ariaLabel = 'Featured work' }: Props = $props();

	let wrap: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!wrap || slides.length === 0) return;
		const root = wrap;
		const done = initCascadingSlider(root);
		return () => done();
	});
</script>

{#if slides.length}
	<div bind:this={wrap} data-cascading-slider-wrap class="cascading-slider" aria-label={ariaLabel} aria-roledescription="carousel">
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
				class="cascading-slider__button"
			>
				<svg
					class="cascading-slider__button-arrow is--prev"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M15 18l-6-6 6-6"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
			<button
				type="button"
				data-cascading-slider-next
				aria-label="Next slide"
				class="cascading-slider__button"
			>
				<svg
					class="cascading-slider__button-arrow"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M9 18l6-6-6-6"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</nav>
	</div>
{/if}
