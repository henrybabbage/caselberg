import { contactPageQuery } from '$lib/groq';
import { getSanityClient, isSanityConfigured } from '$lib/sanity.server';
import type { ContactPage } from '$lib/types/sanity';

export const load = async () => {
	if (!isSanityConfigured()) {
		return { contactPage: null as ContactPage | null };
	}
	try {
		const contactPage = await getSanityClient().fetch<ContactPage>(contactPageQuery);
		return { contactPage };
	} catch {
		return { contactPage: null as ContactPage | null };
	}
};
