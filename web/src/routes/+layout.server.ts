import type { SanityImageSource } from '@sanity/image-url';

import { siteSettingsQuery } from '$lib/groq';
import { urlForImage } from '$lib/image-url';
import { getSanityClient, isSanityConfigured } from '$lib/sanity.server';
import type { SiteSettings } from '$lib/types/sanity';

const fallbackLogo = '/logo.svg';

function formatAucklandTime(date = new Date()): string {
	return new Intl.DateTimeFormat('en-NZ', {
		timeZone: 'Pacific/Auckland',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	}).format(date);
}

export const load = async () => {
	const aucklandTime = formatAucklandTime();
	if (!isSanityConfigured()) {
		return {
			siteSettings: null as SiteSettings | null,
			logoUrl: fallbackLogo,
			aucklandTime
		};
	}
	try {
		const siteSettings = await getSanityClient().fetch<SiteSettings>(siteSettingsQuery);
		const logoUrl =
			urlForImage(siteSettings?.logo as SanityImageSource | undefined) ?? fallbackLogo;
		return { siteSettings, logoUrl, aucklandTime };
	} catch {
		return { siteSettings: null as SiteSettings | null, logoUrl: fallbackLogo, aucklandTime };
	}
};
