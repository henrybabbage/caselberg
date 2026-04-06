import { dev } from '$app/environment';

import { clientsPageQuery } from '$lib/groq';
import { urlForImage } from '$lib/image-url';
import { getSanityClient, isSanityConfigured } from '$lib/sanity.server';
import type { CascadingSlide } from '$lib/types/cascading';
import type { ClientSlide, ClientsPage } from '$lib/types/sanity';
import type { SanityImageSource } from '@sanity/image-url';

function safeImageUrl(source: SanityImageSource | undefined): string | undefined {
	try {
		return urlForImage(source);
	} catch {
		return undefined;
	}
}

function mapSlides(slides: ClientSlide[] | undefined): CascadingSlide[] {
	const out: CascadingSlide[] = [];
	for (const s of slides ?? []) {
		const src = safeImageUrl(s.image as SanityImageSource);
		if (!src) continue;
		const slide: CascadingSlide = {
			id: s._id,
			title: s.name ?? '',
			description: s.description ?? '',
			src
		};
		const mobile = safeImageUrl(s.imageMobile as SanityImageSource);
		const tablet = safeImageUrl(s.imageTablet as SanityImageSource);
		if (mobile) slide.srcMobile = mobile;
		if (tablet) slide.srcTablet = tablet;
		out.push(slide);
	}
	return out;
}

export const load = async () => {
	if (!isSanityConfigured()) {
		return { clientsPage: null as ClientsPage | null, slides: [] as CascadingSlide[] };
	}
	try {
		const clientsPage = await getSanityClient().fetch<ClientsPage>(clientsPageQuery);
		try {
			const slides = mapSlides(clientsPage?.slides);
			return { clientsPage, slides };
		} catch (mapErr) {
			if (dev) console.error('[clients] mapSlides', mapErr);
			return { clientsPage, slides: [] as CascadingSlide[] };
		}
	} catch (fetchErr) {
		if (dev) console.error('[clients] Sanity fetch', fetchErr);
		return { clientsPage: null as ClientsPage | null, slides: [] as CascadingSlide[] };
	}
};
