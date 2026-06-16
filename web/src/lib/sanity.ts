import { createClient } from '@sanity/sveltekit';

import { env as publicEnv } from '$env/dynamic/public';

export const projectId = publicEnv.PUBLIC_SANITY_PROJECT_ID || 'missing-project';
export const dataset = publicEnv.PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = publicEnv.PUBLIC_SANITY_API_VERSION || '2024-01-01';
export const studioUrl = publicEnv.PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333';

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true,
	stega: {
		enabled: true,
		studioUrl
	}
});
