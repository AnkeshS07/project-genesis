# CI Runbook (Epic 00 / M11)

GitHub Actions CI for the Project Genesis monorepo. **CI only** — no deploy, registry push, or cloud provider wiring.

## Workflows

| Workflow | File                                   | Purpose                                                                                                     |
| -------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **CI**   | [`.github/workflows/ci.yml`](./ci.yml) | Lint, typecheck, unit/API/optional integration, Docker image builds; on `main` also E2E + coverage artifact |

Shared setup: [`.github/actions/setup-node-pnpm`](../actions/setup-node-pnpm) — Node from `.nvmrc` (20), Corepack, `pnpm@9.15.9`, frozen lockfile, pnpm store cache.

## Trigger strategy

| Event              | Jobs                                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| **Pull request**   | `lint` · `typecheck` → `test-unit` · `test-api` · `test-integration` · `docker` |
| **Push to `main`** | Above → `test-e2e` (Chromium) · `test-cov` (+ coverage artifact)                |

No publish. No image push. No release automation.

## Job graph (fail-fast)

```text
lint ─────────┐
              ├──► test-unit ──┐
typecheck ────┤                ├──► test-e2e   (main only)
              ├──► test-api ───┘
              ├──► test-integration
              ├──► docker
              └──► test-unit ──► test-cov      (main only)
```

- `lint` and `typecheck` run in parallel (quality gate).
- Unit, API, integration, and Docker **`needs: [lint, typecheck]`** — skipped/cancelled path when the gate fails (no wasted runners).
- E2E also needs unit + API; coverage needs unit.
- Within each job, a failing step stops later steps (Actions default). The workflow conclusion is **failure** if any required job fails.

## Job map (requirement coverage)

| Requirement         | Job                                                                  |
| ------------------- | -------------------------------------------------------------------- |
| Lint                | `lint` → `pnpm lint` + `pnpm format:check`                           |
| Typecheck           | `typecheck` → `pnpm typecheck`                                       |
| Unit tests          | `test-unit` → `pnpm test:unit`                                       |
| API tests           | `test-api` → `pnpm test:api`                                         |
| E2E (Chromium)      | `test-e2e` → `pnpm test:e2e` (**main only**)                         |
| Docker image builds | `docker` → M10 Dockerfiles + Compose `config` + Buildx GHA cache     |
| Coverage artifact   | `test-cov` → `pnpm test:cov` + upload (**main only**, informational) |

## Permissions

```yaml
permissions:
  contents: read # checkout
  actions: write # pnpm/Playwright/Docker GHA caches + artifact upload
```

No `contents: write`, packages, or `id-token`. **Future OIDC:** add `id-token: write` only when a deploy job exists.

## Caching

| Cache               | Where                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------- |
| pnpm store          | `actions/setup-node` `cache: pnpm` in composite action                                 |
| Playwright browsers | `~/.cache/ms-playwright` keyed by lockfile                                             |
| Docker layers       | Buildx `cache-from` / `cache-to` `type=gha` — `scope=server` (api+worker), `scope=web` |

API then Worker in the same job also reuse the local Buildx layer cache within that run.

## Environment variables

### Always set by the workflow

| Variable                  | Value  |
| ------------------------- | ------ |
| `CI`                      | `true` |
| `HUSKY`                   | `0`    |
| `NEXT_TELEMETRY_DISABLED` | `1`    |

### Optional integration (`TEST_*`)

| Variable            | Where                        | Effect                                         |
| ------------------- | ---------------------------- | ---------------------------------------------- |
| `TEST_DATABASE_URL` | GitHub **Secret** (or unset) | With Redis URL, enables integration assertions |
| `TEST_REDIS_URL`    | GitHub **Secret** (or unset) | With Mongo URL, enables integration assertions |

When unset, `pnpm test:integration` **skips cleanly**. Secrets are passed only as step `env` (GitHub auto-masks). **Do not** `echo`, `printenv`, or log these values.

## Docker in CI

- Reuses M10 Dockerfiles; tags `project-genesis-*:ci`
- Compose `config` for dev + prod with `docker/.env.example`
- **Verify only** — `push: false` / `load: true` via `docker/build-push-action`
- See [`docker/README.md`](../../docker/README.md)

## Artifacts

| Artifact                               | When                                     | Retention |
| -------------------------------------- | ---------------------------------------- | --------- |
| `coverage-reports`                     | `main` · `test-cov` **success** only     | 14 days   |
| `playwright-report` (+ `test-results`) | E2E **`failure() && !cancelled()`** only | 7 days    |

## Local parity

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:api
pnpm test:integration   # skips without TEST_*
docker compose -f docker/docker-compose.yml --env-file docker/.env.example config --quiet
docker build -f docker/Dockerfile.api -t project-genesis-api:ci .
docker build -f docker/Dockerfile.worker -t project-genesis-worker:ci .
docker build -f docker/Dockerfile.web -t project-genesis-web:ci --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001 .

# main-only in CI:
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
pnpm test:cov
```

## Troubleshooting

| Symptom                                        | Likely cause                                                                          | Fix                                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Local verify: `pnpm failed: 1` with Usage help | PowerShell reserved `$Args` emptied the script name (agent verify quirk — **not** CI) | Call `pnpm lint` / `npx pnpm@9.15.9 lint` explicitly; do not use a parameter named `$Args` |
| `ERR_PNPM_OUTDATED_LOCKFILE`                   | Lockfile out of sync                                                                  | `pnpm install`; commit `pnpm-lock.yaml`                                                    |
| Docker build OOM / timeout                     | Large web build                                                                       | Re-run (GHA layer cache helps); confirm `.dockerignore`                                    |
| E2E `webServer` timeout                        | Next failed to start                                                                  | Download Playwright artifact on failure                                                    |
| E2E browser missing                            | Cache miss                                                                            | Job installs Chromium when cache misses                                                    |
| Integration always skipped                     | `TEST_*` unset                                                                        | Expected; add Secrets to enable                                                            |
| Coverage artifact empty                        | Path / failed cov job                                                                 | Confirm coverage dirs; upload runs only on success                                         |
| Husky / prepare noise                          | Git hooks                                                                             | Workflow sets `HUSKY=0`                                                                    |
| Downstream jobs skipped                        | Lint or typecheck failed                                                              | Expected fail-fast (`needs`)                                                               |

## Explicitly out of scope (M11)

Deployment, registry push, Kubernetes/Helm/Terraform, Dependabot/Renovate, failing security scanners, release automation, cloud OIDC provider setup.
