# @project-genesis/web

Next.js App Router UI (**Architecture 1.1**).

## Milestone status

| Area                  | Status                                  |
| --------------------- | --------------------------------------- |
| UI shell (M4)         | ✅ App Router, Tailwind, providers      |
| Docker image (M10)    | ✅ `docker/Dockerfile.web` (standalone) |
| shadcn/ui             | ⏳ Deferred to a future UI epic         |
| Business pages / auth | ❌ Later epics                          |

## Rules

- UI only — no business REST APIs in Next.js
- NestJS API base URL: `NEXT_PUBLIC_API_URL`

## Scripts

```bash
pnpm --filter @project-genesis/web dev
pnpm --filter @project-genesis/web build
pnpm --filter @project-genesis/web start
pnpm --filter @project-genesis/web test:unit
pnpm --filter @project-genesis/web test:cov
```

E2E (Chromium) is owned by `tests/e2e` — run `pnpm test:e2e` from the monorepo root.

## Docker (M10)

```bash
docker build -f docker/Dockerfile.web -t project-genesis-web:local --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001 .
```

`next.config.ts` uses `output: 'standalone'` for the production image.
