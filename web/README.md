# Caselberg Studio web

SvelteKit frontend for the Caselberg Studio website. It reads page content, navigation, SEO defaults, logo assets, and carousel slides from Sanity.

For full repository setup, Studio details, deployment notes, and CMS content requirements, see the root [`README.md`](../README.md).

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Local site: [http://localhost:5173](http://localhost:5173)

## Environment

```bash
PUBLIC_SANITY_PROJECT_ID=w1pg51yy
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2024-01-01
```

Optional:

```bash
SANITY_API_READ_TOKEN=...
PUBLIC_AGENTATION_WORKSPACE_ROOT=/absolute/path/to/caselberg
```

Use `SANITY_API_READ_TOKEN` only if the Sanity dataset is private. `PUBLIC_AGENTATION_WORKSPACE_ROOT` is a development-only value used by `sv-agentation`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the SvelteKit dev server |
| `npm run build` | Build the production site |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Run Svelte and TypeScript checks |
| `npm run test:e2e` | Run Playwright tests |
| `npm run test:e2e:reference` | Audit the live reference site |

## Notes

- The home page and `/clients` route use the same Sanity carousel data; `/clients` redirects to `/`.
- Carousel image URLs are generated from Sanity assets with responsive desktop, narrow, tablet, and mobile sizes.
- If Sanity is not configured or content is missing, the app renders fallback development messages instead of failing the page load.
