import type { ClientPerspective, QueryParams, SanityClient } from '@sanity/sveltekit';

import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { client } from '$lib/sanity';

type PreviewLoadQueryOptions = {
	perspective: Exclude<ClientPerspective, 'raw'>;
	useCdn: boolean;
	stega: boolean;
};

function getReadToken(): string | undefined {
	return privateEnv.SANITY_API_READ_TOKEN;
}

export function isSanityConfigured(): boolean {
	const id = publicEnv.PUBLIC_SANITY_PROJECT_ID;
	return Boolean(id && id.length > 0);
}

export const serverClient = client.withConfig({
	...(getReadToken() ? { token: getReadToken() } : {})
});

export function getSanityClient(): SanityClient {
	return serverClient;
}

export function getPreviewLoadQueryOptions(previewEnabled: boolean): PreviewLoadQueryOptions {
	return {
		perspective: previewEnabled ? 'drafts' : 'published',
		useCdn: !previewEnabled,
		stega: previewEnabled
	};
}

export function emptyParams(): QueryParams {
	return {};
}
