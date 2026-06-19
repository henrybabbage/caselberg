import { contactPageQuery } from '$lib/groq';
import { emptyParams, getPreviewLoadQueryOptions, isSanityConfigured } from '$lib/sanity.server';
import type { ContactPage } from '$lib/types/sanity';

export const load = async ({ locals }) => {
	if (!isSanityConfigured()) {
		return {
			contactPage: null as ContactPage | null,
			query: contactPageQuery,
			options: { initial: { data: null as ContactPage | null, sourceMap: undefined } }
		};
	}
	try {
		const initial = await locals.sanity.loadQuery<ContactPage | null>(
			contactPageQuery,
			emptyParams(),
			getPreviewLoadQueryOptions(locals.sanity.previewEnabled)
		);
		return { contactPage: initial.data, query: contactPageQuery, options: { initial } };
	} catch {
		return {
			contactPage: null as ContactPage | null,
			query: contactPageQuery,
			options: { initial: { data: null as ContactPage | null, sourceMap: undefined } }
		};
	}
};
