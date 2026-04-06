import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
	api: {
		projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'w1pg51yy',
		dataset: process.env.SANITY_STUDIO_DATASET ?? 'production'
	},
	/** Hosted Studio URL: https://<studioHost>.sanity.studio — set once; change only if hostname is unavailable. */
	studioHost: 'caselberg-studio'
});
