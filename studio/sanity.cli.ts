import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
	api: {
		projectId: 'w1pg51yy',
		dataset: 'production'
	},
	/** Hosted Studio URL: https://<studioHost>.sanity.studio — set once; change only if hostname is unavailable. */
	studioHost: 'caselbergstudio',
	deployment: {
		appId: 'msii2q2g1wae1hpbklgput3z'
	}
});
