import { createClient, type SanityClient } from '@sanity/client';

import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

function getReadToken(): string | undefined {
	return privateEnv.SANITY_API_READ_TOKEN;
}

export function isSanityConfigured(): boolean {
	const id = publicEnv.PUBLIC_SANITY_PROJECT_ID;
	return Boolean(id && id.length > 0);
}

export function getSanityClient(): SanityClient {
	const token = getReadToken();
	return createClient({
		projectId: publicEnv.PUBLIC_SANITY_PROJECT_ID || 'missing-project',
		dataset: publicEnv.PUBLIC_SANITY_DATASET || 'production',
		apiVersion: publicEnv.PUBLIC_SANITY_API_VERSION || '2024-01-01',
		useCdn: !token,
		...(token ? { token } : {})
	});
}
