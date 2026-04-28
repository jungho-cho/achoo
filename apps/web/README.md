# Achoo Web

Next.js 16 app for Achoo's localized pollen, dust, and allergy-weather experience.

The app is part of the pnpm/Turborepo workspace and is deployed to Cloudflare Workers through OpenNext.

## Local Development

Run from the repository root:

```bash
pnpm install
pnpm --filter web dev
```

The dev server runs on `http://localhost:3001`.

## Main Scripts

Run these from the repository root unless you are intentionally working inside `apps/web`.

```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web lint
pnpm --filter web check-types
pnpm run deploy:web
```

`pnpm run deploy:web` calls the web package deploy script explicitly and is the preferred CLI deploy command.

## App Structure

- `app/[locale]`: localized app routes.
- `app/api`: pollen and dust API route handlers.
- `components/content`: article and insight rendering components.
- `content/articles`: static article catalog, localized article copy, source metadata, and schema.
- `hooks`: client data hooks for pollen and dust data.
- `i18n` and `messages`: locale routing and UI message files.
- `lib`: SEO, article loading, and shared app helpers.

## Insight Content

Article pages are static content-driven routes.

- Add route metadata in `content/articles/catalog.ts`.
- Add citations in `content/articles/sources.ts`.
- Add localized copy in `content/articles/localizations.ts`.
- Keep the supported locales in sync: `ko`, `en`, `de`, and `fr`.

`lib/articles.ts` validates article consistency at module load. Missing source ids, duplicate ids or slugs, missing locale records, broken related ids, and duplicate block ids fail during build/type-check paths instead of silently shipping.

After adding article content, run:

```bash
pnpm lint --force
pnpm check-types --force
pnpm build --force
```

The current production build should generate `109/109` static pages.

## Cloudflare Workers

OpenNext handles the Workers build and deploy flow.

```bash
pnpm run deploy:web
```

Required runtime bindings/secrets are documented in the repository root `README.md`.

After deploy, verify at least:

- `https://achoo.day/sitemap.xml`
- one localized page under `https://achoo.day/ko`
- any newly added insight URLs across the supported locales
