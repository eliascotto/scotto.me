# AGENTS

## Project Background
- `scotto.me-astro` is a 1:1 Astro port of the existing Eleventy blog stored in `../scotto.me`.
- Content, assets, routing, and meta tags must stay in sync with the source blog. When updating the Eleventy project, mirror the same change here (and vice versa).
- Styling relies on the pre-built CSS copied from the Eleventy output (`public/assets/css` and `public/styles`). Avoid introducing new styling systems unless the upstream project changes.

## Development Workflow
- Install dependencies with `npm install`.
- `npm run dev` starts the Astro dev server; `npm run build` generates the static site in `dist/`.
- Blog content lives in `src/content/{articles,posts,translations}`; shared helpers sit in `src/lib`.
- Layout, menu, and metadata logic are centralized under `src/layouts` and `src/components` to preserve parity.

## Release Expectations
- Build output should match the Eleventy site (URLs with trailing slashes, RSS at `/feed.xml`, translations under `/blog/:slug/ita/`).
- Any automation or agent modifying content must verify both the Astro and Eleventy projects render the same pages before shipping.
