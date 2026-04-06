import { homePageQuery } from '$lib/groq';
import { getSanityClient, isSanityConfigured } from '$lib/sanity.server';
import type { HomePage } from '$lib/types/sanity';

export const load = async () => {
	if (!isSanityConfigured()) {
		return { homePage: null as HomePage | null };
	}
	try {
		const homePage = await getSanityClient().fetch<HomePage>(homePageQuery);
		return { homePage };
	} catch {
		return { homePage: null as HomePage | null };
	}
};
