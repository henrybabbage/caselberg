# Caselberg Studio website

Website and CMS for [Caselberg Studio](https://www.caselbergstudio.com), a brand and creative studio. The repository is split into a SvelteKit public site and a Sanity Studio content workspace.

## Project structure

```text
.
├── web/      # SvelteKit 2, Svelte 5, Tailwind CSS 4 public website
├── studio/   # Sanity Studio 5 schemas, structure, import, and seed scripts
└── docs/     # Optional Playwright reference-audit output
```

## Stack

- **Frontend:** SvelteKit, Svelte 5, Vite, Tailwind CSS, GSAP
- **CMS:** Sanity Studio, GROQ, `@sanity/client`, `@sanity/image-url`
- **Content rendering:** Portable Text for rich body copy
- **Testing:** Svelte type checks and Playwright browser tests
- **Primary content source:** Sanity project `w1pg51yy`, dataset `production`

## Features

- Responsive portfolio carousel powered by Sanity `client` documents.
- Separate mobile and tablet slide images when content editors provide them.
- Sanity-managed site settings, navigation, SEO defaults, logo, about copy, and contact details.
- Singleton Sanity documents for the main pages: `siteSettings`, `homePage`, `clientsPage`, `aboutPage`, and `contactPage`.
- Auckland time display in the shared layout.
- Fallback UI when required Sanity content is missing, so local development can start before the CMS is fully populated.

## Prerequisites

- Node.js 20 or newer.
- npm, using the lockfiles committed in `web/` and `studio/`.
- Access to the Caselberg Studio Sanity project if you need to edit or import CMS content.
- Playwright browsers for end-to-end tests: run `npx playwright install` from `web/` when needed.

The site includes fonts and brand assets in `web/static/`. Keep their licensing in mind before reusing them outside this project.

## Environment

Create local environment files from the examples:

```bash
cd studio
cp .env.example .env

cd ../web
cp .env.example .env
```

### `studio/.env`

```bash
SANITY_STUDIO_PROJECT_ID=w1pg51yy
SANITY_STUDIO_DATASET=production
SANITY_API_WRITE_TOKEN=...
```

`SANITY_API_WRITE_TOKEN` is only needed for `npm run seed` and `npm run scrape-import`. Use a Sanity token with Editor or Developer access.

### `web/.env`

```bash
PUBLIC_SANITY_PROJECT_ID=w1pg51yy
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2024-01-01
```

If the dataset is private, also set `SANITY_API_READ_TOKEN` in `web/.env`. Public values are exposed to the browser and should only contain read-only project metadata.

Add these origins to the Sanity project's CORS settings:

- `http://localhost:5173`
- `https://www.caselbergstudio.com`
- Any preview or deployment URLs used by the host

## Local development

Install and run the two apps in separate terminals.

```bash
cd studio
npm install
npm run dev
```

```bash
cd web
npm install
npm run dev
```

The web app runs at [http://localhost:5173](http://localhost:5173). Sanity Studio prints its local URL when `npm run dev` starts.

## CMS content model

The Studio uses a custom desk structure in `studio/structure.ts`:

| Document ID | Schema type | Purpose |
| --- | --- | --- |
| `siteSettings` | `siteSettings` | Site name, logo, SEO defaults, and navigation |
| `homePage` | `homePage` | Home page singleton |
| `clientsPage` | `clientsPage` | Carousel title, label, and ordered work slide references |
| `aboutPage` | `aboutPage` | About page Portable Text body |
| `contactPage` | `contactPage` | Contact heading, email, Instagram, and phone |

Work slides are stored as `client` documents. Each slide needs a main image, name, and description. Optional mobile and tablet images improve responsive crops.

To bootstrap singleton documents:

```bash
cd studio
npm run seed
```

To import the known client carousel assets and copy from the legacy/live Squarespace source:

```bash
cd studio
npm run scrape-import
```

Both commands write to Sanity and require `SANITY_API_WRITE_TOKEN`.

## Useful scripts

### Website

Run from `web/`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the SvelteKit dev server |
| `npm run build` | Build the production site |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Run Svelte and TypeScript checks |
| `npm run test:e2e` | Run all Playwright tests |
| `npm run test:e2e:reference` | Audit the reference site and update route inventory output |

### Studio

Run from `studio/`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Sanity Studio locally |
| `npm run start` | Serve a built Sanity Studio |
| `npm run build` | Build the Studio |
| `npm run deploy` | Deploy the hosted Studio |
| `npm run seed` | Create or replace required singleton documents |
| `npm run scrape-import` | Import carousel assets and page copy from the legacy/live source |

## Deployment

The public website can be deployed with any SvelteKit-compatible host. The current adapter is `@sveltejs/adapter-auto`, so set the same web environment variables in the deployment platform.

Sanity Studio is configured in `studio/sanity.cli.ts` with:

- Hosted Studio: `https://caselbergstudio.sanity.studio`
- Project ID: `w1pg51yy`
- Dataset: `production`

Deploy the Studio from `studio/`:

```bash
npm run deploy
```

## Reference audit

`web/tests/reference-audit.spec.ts` uses Playwright against `https://www.caselbergstudio.com` and writes route inventory data to `docs/route-inventory.json`.

```bash
cd web
npx playwright install
npm run test:e2e:reference
```

Screenshots generated during the audit are intentionally not part of the committed source unless the `.gitignore` policy changes.

## Dependency source lookup

For deeper source context on dependencies, agents can vendor selected package sources with [vercel-labs/opensrc](https://github.com/vercel-labs/opensrc). Run from `web/`, where the app lockfile lives:

```bash
cd web
npx opensrc @sanity/client @sanity/image-url @portabletext/svelte gsap sveltejs/kit --modify
```

This writes indexed dependency sources under `web/opensrc/` and updates ignore/config files as needed.

## License

Private project. All rights reserved by the project owner.
