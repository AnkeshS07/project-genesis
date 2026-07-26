# @project-genesis/server

NestJS REST API and NestJS Workers (**Architecture 1.1**).

## Milestone status

| Area                       | Status                                                 |
| -------------------------- | ------------------------------------------------------ |
| NestJS API core (M3)       | ✅ Config, logger, health, swagger                     |
| MongoDB / Redis (M5)       | ✅ Connection modules + dependency readiness           |
| Provider abstractions (M6) | ✅ AI / Storage / Search interfaces (Not Implemented)  |
| BullMQ workers (M7)        | ✅ Queue + worker infrastructure (no business jobs)    |
| Observability (M8)         | ✅ TelemetryModule + ALS + Logger/Metrics/Tracer ports |
| Testing (M9)               | ✅ Jest unit/API + Playwright Chromium E2E scaffold    |
| Docker (M10)               | ✅ Multi-stage images + dev/prod Compose               |
| Domain modules             | ❌ Later epics                                         |

## Local dependencies (M5+)

```bash
# From monorepo root
docker compose -f docker/docker-compose.infra.yml up -d
cp .env.example .env   # if needed — DATABASE_URL + REDIS_URL required
pnpm --filter @project-genesis/server start:dev
pnpm --filter @project-genesis/server start:worker:dev
```

## Scripts

```bash
pnpm --filter @project-genesis/server start:dev
pnpm --filter @project-genesis/server start:prod
pnpm --filter @project-genesis/server start:worker
pnpm --filter @project-genesis/server start:worker:dev
pnpm --filter @project-genesis/server build
```

## Endpoints (API process)

- `GET /health` — overall status + MongoDB/Redis checks
- `GET /ready` — 200 only when MongoDB and Redis are up; otherwise 503
- `GET /live` — process liveness (no dependency checks)
- Swagger UI: `/docs`

## Queues (M7)

Infrastructure queues only: `default`, `system`.

Workers refuse any job with "Not Implemented". Feature jobs are deferred.

## Observability (M8)

- `TelemetryModule` (`@Global`) — Logger, Metrics, Tracer, Audit ports
- AsyncLocalStorage correlation (`x-request-id`, `x-correlation-id`)
- Metrics / Tracer = NoOp (no Prometheus, Grafana, or OpenTelemetry SDK)
- Timing interceptor records infra HTTP metrics via NoOp sink
- Process error listeners registered on boot and detached on graceful shutdown
- Worker entrypoint keeps a single pre-DI `console.error` line only (AppLogger unavailable until Nest context exists)

### AppLogger fields

Every `AppLogger` entry is one structured object:

| Field                           | When present                                  |
| ------------------------------- | --------------------------------------------- |
| `msg`                           | Always                                        |
| `service`                       | Process default (`api` / `worker`) and/or ALS |
| `requestId`, `correlationId`    | HTTP ALS                                      |
| `jobId`, `queueName`, `jobName` | Worker job ALS                                |
| caller fields                   | Per call site (sensitive keys redacted)       |
| `err`                           | `error()` only                                |

## Testing (M9)

```bash
# From monorepo root
pnpm test:unit
pnpm test:api
pnpm test:integration
pnpm test:e2e
pnpm test:cov

# Server package-local
pnpm --filter @project-genesis/server test:unit
pnpm --filter @project-genesis/server test:api
pnpm --filter @project-genesis/server test:integration
pnpm --filter @project-genesis/server test:cov
```

See `tests/README.md` for pyramid, ownership, and optional `TEST_*` URLs. Worker unit tests are Redis/BullMQ-free.

## Docker (M10)

```bash
# From repo root
docker build -f docker/Dockerfile.api -t project-genesis-api:local .
docker build -f docker/Dockerfile.worker -t project-genesis-worker:local .
docker compose -f docker/docker-compose.yml --env-file docker/.env.example up --build -d
```

API health: `GET /live` · Worker has no HTTP port. Full runbook: `docker/README.md`.
