import type { SanityImageSource } from '@sanity/image-url';

import { siteSettingsQuery } from '$lib/groq';
import { urlForImage } from '$lib/image-url';
import { emptyParams, getPreviewLoadQueryOptions, isSanityConfigured } from '$lib/sanity.server';
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

export const load = async ({ locals }) => {
	const aucklandTime = formatAucklandTime();
	if (!isSanityConfigured()) {
		return {
			siteSettings: null as SiteSettings | null,
			logoUrl: fallbackLogo,
			aucklandTime,
			previewEnabled: locals.sanity.previewEnabled
		};
	}
	try {
		const initial = await locals.sanity.loadQuery<SiteSettings | null>(
			siteSettingsQuery,
			emptyParams(),
			getPreviewLoadQueryOptions(locals.sanity.previewEnabled)
		);
		const siteSettings = initial.data;
		const logoUrl =
			urlForImage(siteSettings?.logo as SanityImageSource | undefined) ?? fallbackLogo;
		return {
			siteSettings,
			logoUrl,
			aucklandTime,
			previewEnabled: locals.sanity.previewEnabled
		};
	} catch {
		return {
			siteSettings: null as SiteSettings | null,
			logoUrl: fallbackLogo,
			aucklandTime,
			previewEnabled: locals.sanity.previewEnabled
		};
	}
};
