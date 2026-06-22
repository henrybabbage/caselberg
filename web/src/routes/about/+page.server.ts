import { aboutPageQuery } from '$lib/groq';
import { emptyParams, getPreviewLoadQueryOptions, isSanityConfigured } from '$lib/sanity.server';
import type { AboutPage } from '$lib/types/sanity';

export const load = async ({ locals }) => {
	if (!isSanityConfigured()) {
		return {
			aboutPage: null as AboutPage | null,
			query: aboutPageQuery,
			options: { initial: { data: null as AboutPage | null, sourceMap: undefined } }
		};
	}
	try {
		const initial = await locals.sanity.loadQuery<AboutPage | null>(
			aboutPageQuery,
			emptyParams(),
			getPreviewLoadQueryOptions(locals.sanity.previewEnabled)
		);
		return { aboutPage: initial.data, query: aboutPageQuery, options: { initial } };
	} catch {
		return {
			aboutPage: null as AboutPage | null,
			query: aboutPageQuery,
			options: { initial: { data: null as AboutPage | null, sourceMap: undefined } }
		};
	}
};
