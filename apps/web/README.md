# @project-genesis/web

Next.js App Router UI (**Architecture 1.1**).

## Milestone status

| Area                  | Status                             |
| --------------------- | ---------------------------------- |
| UI shell (M4)         | ✅ App Router, Tailwind, providers |
| shadcn/ui             | ⏳ Deferred to a future UI epic    |
| Business pages / auth | ❌ Later epics                     |

## Rules

- UI only — no business REST APIs in Next.js
- NestJS API base URL: `NEXT_PUBLIC_API_URL`

## Scripts

```bash
pnpm --filter @project-genesis/web dev
pnpm --filter @project-genesis/web build
pnpm --filter @project-genesis/web start
```
