# docker/

Container definitions for local and production-like runs (**Architecture 1.1** / Epic 00 **M10**).

## Quick start (full stack)

From the **repository root**:

```bash
# Validate compose files
docker compose -f docker/docker-compose.yml --env-file docker/.env.example config
docker compose -f docker/docker-compose.prod.yml --env-file docker/.env.example config

# Build images
docker build -f docker/Dockerfile.api -t project-genesis-api:local .
docker build -f docker/Dockerfile.worker -t project-genesis-worker:local .
docker build -f docker/Dockerfile.web -t project-genesis-web:local --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001 .

# Development stack (Mongo + Redis + API + Worker + Web)
docker compose -f docker/docker-compose.yml --env-file docker/.env.example up --build -d

# Production-oriented stack (no bind mounts)
docker compose -f docker/docker-compose.prod.yml --env-file docker/.env.example up --build -d
```

Stop:

```bash
docker compose -f docker/docker-compose.yml down
docker compose -f docker/docker-compose.prod.yml down
```

## Services

| Service   | Image / Dockerfile  | Role                    | Health               |
| --------- | ------------------- | ----------------------- | -------------------- |
| `mongodb` | `mongo:7`           | Persistent data         | `mongosh` ping       |
| `redis`   | `redis:7-alpine`    | Cache / BullMQ          | `redis-cli ping`     |
| `api`     | `Dockerfile.api`    | NestJS REST             | `GET /live`          |
| `worker`  | `Dockerfile.worker` | NestJS Workers + BullMQ | entry artifact check |
| `web`     | `Dockerfile.web`    | Next.js UI (standalone) | `GET /`              |

## Networking

- Bridge network: `project-genesis-net` (dev) / `project-genesis-prod-net` (prod)
- In-compose URLs use service DNS: `mongodb`, `redis`, `api`, `worker`, `web`
- Browser calls API via host-mapped port (`NEXT_PUBLIC_API_URL=http://localhost:3001`)

## Environment

| File                       | Purpose                                               |
| -------------------------- | ----------------------------------------------------- |
| `.env.example` (repo root) | App env documentation (no secrets)                    |
| `docker/.env.example`      | Compose host ports + build args                       |
| `docker/.env`              | Local overrides (gitignored pattern via root `.env*`) |

Runtime secrets must be injected via Compose `environment` / secrets managers — never bake secrets into images.

Inside Compose, API/Worker use:

```text
DATABASE_URL=mongodb://mongodb:27017/project-genesis
REDIS_URL=redis://redis:6379
```

## Infra-only (M5)

Mongo + Redis without app containers:

```bash
docker compose -f docker/docker-compose.infra.yml up -d
```

Host Redis published on **6380** in infra/dev compose to avoid clashing with a local Redis on 6379.

## Images (design)

- Multi-stage builds, `node:20-alpine`
- `pnpm` via Corepack (`9.15.9`)
- Non-root `app` user
- `tini` for PID 1 / signal forwarding (`STOPSIGNAL SIGTERM`)
- Nest `enableShutdownHooks` for graceful shutdown (SIGINT + SIGTERM)
- Web: `DOCKER_BUILD=1` enables Next.js `output: 'standalone'` inside the image build
- `@project-genesis/types` / `sdk` export TypeScript **source** so Next `transpilePackages` resolves in Docker
- Production compose: `read_only` + `/tmp` tmpfs + `no-new-privileges` where practical

## Restart policies

| Compose file               | Policy           | Why                                                                                |
| -------------------------- | ---------------- | ---------------------------------------------------------------------------------- |
| `docker-compose.yml` (dev) | `unless-stopped` | Survive Docker daemon restarts during local work; stop sticks if you `docker stop` |
| `docker-compose.prod.yml`  | `always`         | Production-oriented — always bring the process back unless removed                 |

## Signals / graceful shutdown

- Images use `tini` as PID 1 and `STOPSIGNAL SIGTERM`
- Nest API/Worker call `enableShutdownHooks()` (handles **SIGTERM** and **SIGINT**)
- `docker stop` → SIGTERM → Nest closes HTTP/workers/connections
- Attached `Ctrl+C` / `docker kill -s SIGINT` → SIGINT → same Nest shutdown path via tini forwarding

## Resource limits

CPU/memory limits are **intentionally deferred** in M10:

- Local Compose limits vary by Docker Desktop resources and would be guesswork without load data
- Swarm-style `deploy.resources` is not the primary path for this bootstrap Compose
- Cap limits in M11/ops once real sizing exists (API vs Worker vs Web profiles)

Until then, rely on Docker Desktop / host defaults.

## Layer caching & reproducibility

Rebuilds stay fast because:

1. **Package manifests copy first** (`package.json` / lockfile) → `pnpm install` layer caches until deps change
2. **Source copies later** → code-only changes rebuild compile layers, not the full install
3. **BuildKit pnpm store cache mount** (`--mount=type=cache,id=pnpm-store,…`) reuses downloaded packages across builds
4. **Multi-stage runners** copy only `/deploy` or Next standalone — no toolchain in final images

Builds do **not** depend on host `node_modules` or host OS Node:

- Context excludes `node_modules`, `.git`, `.env*`, tests, docs (see root `.dockerignore`)
- Install uses `pnpm install --frozen-lockfile` inside Linux build containers
- Final images run Alpine + pinned pnpm via Corepack (`9.15.9`)

## Image sizes (M10 hardening, 2026-07-26)

| Image  | Tag                            | Size      |
| ------ | ------------------------------ | --------- |
| API    | `project-genesis-api:local`    | **314MB** |
| Worker | `project-genesis-worker:local` | **314MB** |
| Web    | `project-genesis-web:local`    | **300MB** |

Re-check with:

```bash
docker images --format "{{.Repository}}:{{.Tag}} {{.Size}}" | findstr project-genesis
```

## Nginx placeholder

See `docker/nginx/README.md` — not enabled in M10.

## CI note (M11)

GitHub Actions (`.github/workflows/ci.yml`) **verifies** these Dockerfiles and Compose configs on every PR/`main` push (after lint + typecheck gate):

- `docker compose … config` (dev + prod)
- Buildx builds for `api`, `worker`, `web` (tags `*:ci`, **no push**)
- Layer cache via GitHub Actions cache (`scope=server` for api/worker, `scope=web` for web)

Images are **not** pushed to a registry. Full CI runbook: [`.github/workflows/README.md`](../.github/workflows/README.md).
