# Caselberg Studio

Monorepo for the Caselberg Studio marketing site: **Sanity CMS** (`studio/`) and **SvelteKit + Tailwind** front end (`web/`).

## Prerequisites

- Node.js 20+
- A [Sanity](https://www.sanity.io/) project and dataset

Bundled web fonts in `web/static/fonts/` (Neue Haas Unica, Exposure VAR) and logo `web/static/logo.svg` must be licensed for your use. Sanity can replace the logo via `siteSettings.logo`.

## Setup

### 1. Studio

```bash
cd studio
cp .env.example .env
```

Set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` in `.env`. Optionally replace `<your-project-id>` in `sanity.config.ts` / `sanity.cli.ts`.

Optional bootstrap (requires **Editor** API token in `.env` as `SANITY_API_WRITE_TOKEN` — Viewer tokens cannot create documents):

```bash
npm run seed   # optional; needs Editor token (see .env.example)
npm run dev
```

Create singleton documents with these **document IDs** (via Structure → each singleton) if you skip `npm run seed`:

| ID            | Type          |
| ------------- | ------------- |
| `siteSettings`| | Site settings |
| `homePage`    | Home |
| `clientsPage` | Clients page (add **Work slides** references) |
| `aboutPage`   | About |
| `contactPage` | Contact |

Add **Work slides** (`client` documents) with **Image**, **Name**, and **Description** for the cascading carousel (optional mobile/tablet images). Older entries that used `title` still resolve via GROQ `coalesce(name, title)`.

### 2. Web

```bash
cd web
cp .env.example .env
```

Set `PUBLIC_SANITY_PROJECT_ID` (and optionally `PUBLIC_SANITY_DATASET`, `PUBLIC_SANITY_API_VERSION`) to match the Studio project. Allow **CORS** origin `http://localhost:5173` (and your production URL) on the Sanity project.

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 3. Reference site audit (optional)

From `web/` after installing browsers once (`npx playwright install`):

```bash
npm run test:e2e:reference
```

Writes `docs/route-inventory.json` and `docs/screenshots/home.png` (gitignored screenshots folder except JSON path — adjust `.gitignore` if you want to commit screenshots).

## Scripts

| Location | Command | Purpose |
| -------- | ------- | ------- |
| `web/` | `npm run dev` | SvelteKit dev server |
| `web/` | `npm run build` | Production build |
| `web/` | `npm run check` | Typecheck |
| `studio/` | `npm run dev` | Sanity Studio |
| `studio/` | `npm run build` | Static Studio build |

See [AGENTS.md](./AGENTS.md) for opensrc / agent notes.

## License

Private / per project owner.
