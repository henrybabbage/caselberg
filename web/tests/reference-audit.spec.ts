import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { test, expect } from '@playwright/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoDocs = join(__dirname, '..', '..', 'docs');

test.describe('Reference site audit', () => {
	test('inventory routes and sample tokens from caselbergstudio.com', async ({ page, browserName }) => {
		test.skip(browserName !== 'chromium', 'Single-browser inventory');

		const base = 'https://www.caselbergstudio.com';
		await page.goto(base, { waitUntil: 'networkidle' });

		const hrefs = await page.$$eval('a[href]', (anchors) =>
			anchors
				.map((a) => (a as HTMLAnchorElement).getAttribute('href'))
				.filter((h): h is string => Boolean(h))
		);

		const internal = new Set<string>();
		for (const h of hrefs) {
			if (h.startsWith('/') && !h.startsWith('//')) internal.add(h.split('#')[0] ?? h);
			try {
				const u = new URL(h, base);
				if (u.hostname.replace(/^www\./, '') === 'caselbergstudio.com') {
					internal.add(u.pathname || '/');
				}
			} catch {
				/* ignore */
			}
		}
		for (const path of ['/clients', '/about', '/contact']) internal.add(path);

		const routes: {
			path: string;
			finalUrl: string;
			status: number | null;
			title: string;
			tokens?: Record<string, string | undefined>;
		}[] = [];

		for (const path of [...internal].sort()) {
			const r = await page.goto(new URL(path, base).toString(), { waitUntil: 'domcontentloaded' });
			const status = r?.status() ?? null;
			const finalUrl = page.url();
			const title = await page.title();
			const entry: (typeof routes)[0] = { path, finalUrl, status, title };
			try {
				entry.tokens = await page.evaluate(() => {
					const b = document.body;
					if (!b) return {};
					const s = getComputedStyle(b);
					return {
						bodyFontFamily: s.fontFamily,
						bodyFontSize: s.fontSize,
						bodyColor: s.color,
						bodyBackground: s.backgroundColor
					};
				});
			} catch {
				/* blocked or no body */
			}
			routes.push(entry);
		}

		mkdirSync(repoDocs, { recursive: true });
		writeFileSync(join(repoDocs, 'route-inventory.json'), JSON.stringify({ base, routes }, null, 2));

		const shotDir = join(repoDocs, 'screenshots');
		mkdirSync(shotDir, { recursive: true });
		await page.goto(base, { waitUntil: 'networkidle' });
		await page.screenshot({ path: join(shotDir, 'home.png'), fullPage: true });

		expect(routes.length).toBeGreaterThan(0);
	});
});
