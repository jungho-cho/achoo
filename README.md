# Achoo

Multilingual Next.js app for pollen and dust forecasts, built in a pnpm/Turborepo workspace.

## Apps

- `apps/web`: production web app
- `packages/*`: shared UI, API clients, geo helpers, and types

## Local development

```bash
pnpm install
pnpm --filter web dev
```

The app runs on `http://localhost:3001`.

## Cloudflare Workers deployment

This repo is set up to deploy `apps/web` to Cloudflare Workers using OpenNext.

### Required secrets

Set these in the Cloudflare Worker project:

- `AIRKOREA_API_KEY`
- `KMA_POLLEN_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Local preview in Workers runtime

```bash
pnpm --filter web preview
```

### Deploy from CLI

```bash
pnpm run deploy:web
```

### What you need to do in Cloudflare

1. Create a Workers project for `apps/web`.
2. Connect the Git repo or use Wrangler login for CLI deploys.
3. Add the four secrets listed above.
4. After first deploy, verify the custom domain and switch DNS when ready.
