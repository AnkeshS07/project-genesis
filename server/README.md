# @project-genesis/server

NestJS REST API and NestJS Workers (**Architecture 1.1**).

## Milestone status

| Area                 | Status                                       |
| -------------------- | -------------------------------------------- |
| NestJS API core (M3) | ✅ Config, logger, health, swagger           |
| MongoDB / Redis (M5) | ✅ Connection modules + dependency readiness |
| BullMQ workers (M7)  | ⏳ Not started                               |
| Domain modules       | ❌ Later epics                               |

## Local dependencies (M5)

```bash
# From monorepo root
docker compose -f docker/docker-compose.infra.yml up -d
cp .env.example .env   # if needed — DATABASE_URL + REDIS_URL required
pnpm --filter @project-genesis/server start:dev
```

## Scripts

```bash
pnpm --filter @project-genesis/server start:dev
pnpm --filter @project-genesis/server build
pnpm --filter @project-genesis/server start:prod
```

## Endpoints

- `GET /health` — overall status + MongoDB/Redis checks
- `GET /ready` — 200 only when MongoDB and Redis are up; otherwise 503
- `GET /live` — process liveness (no dependency checks)
- Swagger UI: `/docs`
