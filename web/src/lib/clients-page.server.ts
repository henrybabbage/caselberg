import { dev } from '$app/environment';

import { mapSlides } from '$lib/clients-page';
import { clientsPageQuery } from '$lib/groq';
import { emptyParams, getPreviewLoadQueryOptions, isSanityConfigured } from '$lib/sanity.server';
import type { CascadingSlide } from '$lib/types/cascading';
import type { ClientsPage } from '$lib/types/sanity';

type SanityLoadEvent = {
	locals: App.Locals;
};

export const loadClientsPageData = async ({ locals }: SanityLoadEvent) => {
	if (!isSanityConfigured()) {
		return {
			clientsPage: null as ClientsPage | null,
			query: clientsPageQuery,
			options: { initial: { data: null as ClientsPage | null, sourceMap: undefined } },
			slides: [] as CascadingSlide[]
		};
	}
	try {
		const initial = await locals.sanity.loadQuery<ClientsPage | null>(
			clientsPageQuery,
			emptyParams(),
			getPreviewLoadQueryOptions(locals.sanity.previewEnabled)
		);
		const clientsPage = initial.data;
		try {
			const slides = mapSlides(clientsPage?.slides);
			return { clientsPage, query: clientsPageQuery, options: { initial }, slides };
		} catch (mapErr) {
			if (dev) console.error('[clients] mapSlides', mapErr);
			return { clientsPage, query: clientsPageQuery, options: { initial }, slides: [] as CascadingSlide[] };
		}
	} catch (fetchErr) {
		if (dev) console.error('[clients] Sanity fetch', fetchErr);
		return {
			clientsPage: null as ClientsPage | null,
			query: clientsPageQuery,
			options: { initial: { data: null as ClientsPage | null, sourceMap: undefined } },
			slides: [] as CascadingSlide[]
		};
	}
};
