import gsap from 'gsap';

type Breakpoint = { maxWidth: number; activeWidth: number; siblingWidth: number };

const duration = 0.65;
const ease = 'power3.inOut';

const breakpoints: Breakpoint[] = [
	{ maxWidth: 479, activeWidth: 0.78, siblingWidth: 0.08 },
	{ maxWidth: 767, activeWidth: 0.7, siblingWidth: 0.1 },
	{ maxWidth: 991, activeWidth: 0.6, siblingWidth: 0.1 },
	{ maxWidth: Infinity, activeWidth: 0.6, siblingWidth: 0.13 }
];

type SlideData = { title: string; description: string };

function getSettings(): Breakpoint {
	const windowWidth = window.innerWidth;
	for (const b of breakpoints) {
		if (windowWidth <= b.maxWidth) return b;
	}
	return breakpoints[breakpoints.length - 1]!;
}

export function initCascadingSlider(wrapper: HTMLElement): () => void {
	const viewport = wrapper.querySelector<HTMLElement>('[data-cascading-viewport]');
	const prevButton = wrapper.querySelector<HTMLButtonElement>('[data-cascading-slider-prev]');
	const nextButton = wrapper.querySelector<HTMLButtonElement>('[data-cascading-slider-next]');
	const captionEl = wrapper.querySelector<HTMLElement>('[data-cascading-caption]');
	const titleEl = wrapper.querySelector<HTMLElement>('[data-cascading-title]');
	const descriptionEl = wrapper.querySelector<HTMLElement>('[data-cascading-description]');

	if (!viewport || !captionEl || !titleEl || !descriptionEl) {
		return () => {};
	}

	const v = viewport;
	const cap = captionEl;
	const title = titleEl;
	const desc = descriptionEl;

	const originalSlides = Array.from(v.querySelectorAll<HTMLElement>('[data-cascading-slide]'));
	const slideData: SlideData[] = originalSlides.map((slide) => ({
		title: slide.getAttribute('data-slide-title') ?? '',
		description: slide.getAttribute('data-slide-description') ?? ''
	}));
	const originalCount = originalSlides.length;

	const slides = Array.from(v.querySelectorAll<HTMLElement>('[data-cascading-slide]'));
	let totalSlides = slides.length;

	if (totalSlides === 0) return () => {};

	if (totalSlides < 9) {
		const cloneSource = slides.slice();
		while (slides.length < 9) {
			for (const original of cloneSource) {
				const clone = original.cloneNode(true) as HTMLElement;
				clone.setAttribute('data-clone', '');
				v.appendChild(clone);
				slides.push(clone);
			}
		}
		totalSlides = slides.length;
	}

	let activeIndex = 0;
	let isAnimating = false;
	let slideWidth = 0;
	const slotCenters: Record<string, number> = {};
	const slotWidths: Record<string, number> = {};

	function getSlideData(index: number): SlideData {
		return slideData[index % originalCount] ?? { title: '', description: '' };
	}

	function measureCaptionHeight(): void {
		cap.style.height = 'auto';
		cap.classList.add('is--visible');

		let maxHeight = 0;
		for (const data of slideData) {
			title.textContent = data.title;
			desc.textContent = data.description;
			const h = cap.offsetHeight;
			if (h > maxHeight) maxHeight = h;
		}

		cap.style.height = `${maxHeight}px`;
		cap.classList.remove('is--visible');
	}

	function updateCaption(index: number): void {
		const data = getSlideData(index);
		cap.classList.remove('is--visible');
		window.setTimeout(() => {
			title.textContent = data.title;
			desc.textContent = data.description;
		}, 280);
		window.setTimeout(() => {
			cap.classList.add('is--visible');
		}, 480);
	}

	function readGap(): number {
		const raw = getComputedStyle(v).getPropertyValue('--gap').trim();
		if (!raw) return 0;
		const temp = document.createElement('div');
		temp.style.width = raw;
		temp.style.position = 'absolute';
		temp.style.visibility = 'hidden';
		v.appendChild(temp);
		const px = temp.offsetWidth;
		v.removeChild(temp);
		return px;
	}

	function getOffset(slideIndex: number, fromIndex: number = activeIndex): number {
		let distance = slideIndex - fromIndex;
		const half = totalSlides / 2;
		if (distance > half) distance -= totalSlides;
		if (distance < -half) distance += totalSlides;
		return distance;
	}

	function measure(): void {
		const settings = getSettings();
		const viewportWidth = v.offsetWidth;
		const gap = readGap();

		const activeSlideWidth = viewportWidth * settings.activeWidth;
		const siblingSlideWidth = viewportWidth * settings.siblingWidth;
		const farSlideWidth = Math.max(
			0,
			(viewportWidth - activeSlideWidth - 2 * siblingSlideWidth - 4 * gap) / 2
		);

		slideWidth = activeSlideWidth;

		const visibleSlots = [
			{ slot: -2, width: farSlideWidth },
			{ slot: -1, width: siblingSlideWidth },
			{ slot: 0, width: activeSlideWidth },
			{ slot: 1, width: siblingSlideWidth },
			{ slot: 2, width: farSlideWidth }
		];

		let x = 0;
		visibleSlots.forEach((def, i) => {
			slotCenters[String(def.slot)] = x + def.width / 2;
			slotWidths[String(def.slot)] = def.width;
			if (i < visibleSlots.length - 1) x += def.width + gap;
		});

		slotCenters['-3'] = slotCenters['-2']! - farSlideWidth / 2 - gap - farSlideWidth / 2;
		slotWidths['-3'] = farSlideWidth;
		slotCenters['3'] = slotCenters['2']! + farSlideWidth / 2 + gap + farSlideWidth / 2;
		slotWidths['3'] = farSlideWidth;

		for (const slide of slides) {
			slide.style.width = `${slideWidth}px`;
		}
	}

	function getSlideProps(offset: number): gsap.TweenVars {
		const clamped = Math.max(-3, Math.min(3, offset));
		const slotWidth = slotWidths[String(clamped)]!;
		const clipAmount = Math.max(0, (slideWidth - slotWidth) / 2);
		const translateX = slotCenters[String(clamped)]! - slideWidth / 2;
		return {
			x: translateX,
			'--clip': clipAmount,
			zIndex: 10 - Math.abs(clamped)
		};
	}

	function layout(animate: boolean, previousIndex?: number): void {
		slides.forEach((slide, index) => {
			const offset = getOffset(index);
			if (offset < -3 || offset > 3) {
				if (animate && previousIndex !== undefined) {
					const previousOffset = getOffset(index, previousIndex);
					if (previousOffset >= -2 && previousOffset <= 2) {
						const exitSlot = previousOffset < 0 ? -3 : 3;
						gsap.to(slide, { ...getSlideProps(exitSlot), duration, ease, overwrite: true });
						return;
					}
				}
				const parkSlot = offset < 0 ? -3 : 3;
				gsap.set(slide, getSlideProps(parkSlot));
				return;
			}

			const props = getSlideProps(offset);
			slide.setAttribute('data-status', offset === 0 ? 'active' : 'inactive');
			if (animate) {
				gsap.to(slide, { ...props, duration, ease, overwrite: true });
			} else {
				gsap.set(slide, props);
			}
		});
	}

	function goTo(targetIndex: number): void {
		const normalizedTarget = ((targetIndex % totalSlides) + totalSlides) % totalSlides;
		if (isAnimating || normalizedTarget === activeIndex) return;
		isAnimating = true;

		const previousIndex = activeIndex;
		const travelDirection = getOffset(normalizedTarget, previousIndex) > 0 ? 1 : -1;

		slides.forEach((slide, index) => {
			const currentOffset = getOffset(index, previousIndex);
			const nextOffset = getOffset(index, normalizedTarget);
			const wasInRange = currentOffset >= -3 && currentOffset <= 3;
			const willBeVisible = nextOffset >= -2 && nextOffset <= 2;

			if (!wasInRange && willBeVisible) {
				const entrySlot = travelDirection > 0 ? 3 : -3;
				gsap.set(slide, getSlideProps(entrySlot));
			}

			const wasInvisible = Math.abs(currentOffset) >= 3;
			const willBeStaging = Math.abs(nextOffset) === 3;
			const crossesSides = currentOffset * nextOffset < 0;
			if (wasInvisible && willBeStaging && crossesSides) {
				gsap.set(slide, getSlideProps(nextOffset > 0 ? 3 : -3));
			}
		});

		activeIndex = normalizedTarget;
		layout(true, previousIndex);
		updateCaption(activeIndex);
		gsap.delayedCall(duration + 0.05, () => {
			isAnimating = false;
		});
	}

	function onPrev(): void {
		goTo(activeIndex - 1);
	}
	function onNext(): void {
		goTo(activeIndex + 1);
	}
	function onKeyDown(event: KeyboardEvent): void {
		if (event.key === 'ArrowLeft') goTo(activeIndex - 1);
		if (event.key === 'ArrowRight') goTo(activeIndex + 1);
	}

	prevButton?.addEventListener('click', onPrev);
	nextButton?.addEventListener('click', onNext);
	for (const slide of slides) {
		slide.addEventListener('click', function onSlideClick(this: HTMLElement) {
			const index = slides.indexOf(this);
			if (index !== activeIndex) goTo(index);
		});
	}
	document.addEventListener('keydown', onKeyDown);

	let resizeTimer: ReturnType<typeof setTimeout>;
	function onResize(): void {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			measure();
			measureCaptionHeight();
			layout(false);
		}, 100);
	}
	window.addEventListener('resize', onResize);

	measure();
	measureCaptionHeight();
	layout(false);
	title.textContent = getSlideData(0).title;
	desc.textContent = getSlideData(0).description;
	cap.classList.add('is--visible');

	return () => {
		prevButton?.removeEventListener('click', onPrev);
		nextButton?.removeEventListener('click', onNext);
		document.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('resize', onResize);
		clearTimeout(resizeTimer);
		gsap.killTweensOf(slides);
		for (const slide of slides) {
			if (slide.hasAttribute('data-clone')) slide.remove();
		}
	};
}
