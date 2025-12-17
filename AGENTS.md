## Project

`scotto.me` project is a personal blog built with Astro and Tailwind.

## Development Workflow
- Install dependencies with `npm install`.
- `npm run dev` starts the Astro dev server; `npm run build` generates the static site in `dist/`.
- Blog content lives in `src/content/{articles,posts,translations}`; shared helpers sit in `src/lib`.
- Layout, menu, and metadata logic are centralized under `src/layouts` and `src/components` to preserve parity.
