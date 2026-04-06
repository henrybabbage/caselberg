import { aboutPageQuery } from '$lib/groq';
import { getSanityClient, isSanityConfigured } from '$lib/sanity.server';
import type { AboutPage } from '$lib/types/sanity';

export const load = async () => {
	if (!isSanityConfigured()) {
		return { aboutPage: null as AboutPage | null };
	}
	try {
		const aboutPage = await getSanityClient().fetch<AboutPage>(aboutPageQuery);
		return { aboutPage };
	} catch {
		return { aboutPage: null as AboutPage | null };
	}
};
