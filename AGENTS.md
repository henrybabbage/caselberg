# AGENTS.md

Instructions for AI coding agents working on this repository.

## Source code reference (opensrc)

Source code for selected dependencies can be vendored under `opensrc/` for deeper implementation context than types alone.

Use [vercel-labs/opensrc](https://github.com/vercel-labs/opensrc): from **`web/`** (where the app `package-lock.json` lives), run for example:

```bash
cd web && npx opensrc @sanity/client @sanity/image-url @portabletext/svelte gsap sveltejs/kit --modify
```

- `--modify` updates `.gitignore` (adds `opensrc/`), excludes `opensrc/` from `tsconfig` where applicable, and can merge a short section into an `AGENTS.md` in that folder.
- See `web/opensrc/sources.json` for indexed packages and versions (path is relative to where you ran the command).

## Layout

- `web/` — SvelteKit + Tailwind public site; GROQ via `@sanity/client`.
- `studio/` — Sanity Studio v3; schemas in `studio/schemaTypes/`.
- `docs/route-inventory.json` — optional output from Playwright reference audit (`npm run test:e2e:reference` in `web/`).
