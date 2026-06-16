import type { SanityImageSource } from '@sanity/image-url';

import { urlForImage } from '$lib/image-url';
import type { CascadingSlide } from '$lib/types/cascading';
import type { ClientSlide } from '$lib/types/sanity';

type SliderImageSize = {
	width: number;
	height: number;
};

const sliderImageSizes = {
	mobile: { width: 720, height: 1200 },
	tablet: { width: 960, height: 1100 },
	narrow: { width: 1120, height: 1120 },
	desktop: { width: 1440, height: 1168 }
} satisfies Record<string, SliderImageSize>;

function safeImageUrl(
	source: SanityImageSource | undefined,
	size: SliderImageSize
): string | undefined {
	try {
		return urlForImage(source, size);
	} catch {
		return undefined;
	}
}

export function mapSlides(slides: ClientSlide[] | undefined): CascadingSlide[] {
	const out: CascadingSlide[] = [];
	for (const s of slides ?? []) {
		if (!s?._id) continue;
		const image = s.image as SanityImageSource | undefined;
		const src = safeImageUrl(image, sliderImageSizes.desktop);
		if (!src) continue;
		const slide: CascadingSlide = {
			id: s._id,
			title: s.name ?? '',
			description: s.description ?? '',
			src
		};
		const mobile = safeImageUrl(
			(s.imageMobile as SanityImageSource | undefined) ?? image,
			sliderImageSizes.mobile
		);
		const tablet = safeImageUrl(
			(s.imageTablet as SanityImageSource | undefined) ?? image,
			sliderImageSizes.tablet
		);
		const narrow = safeImageUrl(image, sliderImageSizes.narrow);
		if (mobile) slide.srcMobile = mobile;
		if (tablet) slide.srcTablet = tablet;
		if (narrow) slide.srcNarrow = narrow;
		out.push(slide);
	}
	return out;
}
