# docker/

Container definitions for local and production-like runs (**Architecture 1.1**).

## M5 — infrastructure only

Minimal MongoDB + Redis for local API connectivity checks:

```bash
docker compose -f docker/docker-compose.infra.yml up -d
```

Defaults:

| Service | Host port | Container |
| ------- | --------- | --------- |
| MongoDB | `27017`   | `27017`   |
| Redis   | `6380`    | `6379`    |

If you use this Compose file, set:

```env
DATABASE_URL=mongodb://localhost:27017/project-genesis
REDIS_URL=redis://localhost:6380
```

If Redis is already available on `6379`, you can skip the Compose Redis service and keep `REDIS_URL=redis://localhost:6379`.

Stop:

```bash
docker compose -f docker/docker-compose.infra.yml down
```

## M10 — full stack (not yet)

Expected Compose services:

- `web` — Next.js (`apps/web`)
- `api` — NestJS REST API (`server`)
- `worker` — NestJS Workers + BullMQ (`server`)
- `mongodb`
- `redis`

Dockerfiles and full Compose files are added in **M10**.
