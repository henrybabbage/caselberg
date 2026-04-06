import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	use: {
		baseURL: 'https://www.caselbergstudio.com',
		trace: 'on-first-retry'
	}
});
