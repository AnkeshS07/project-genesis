# Testing (Epic 00 / M9)

## Testing Pyramid

| Layer                 | Approx. share of suite | Location                                     |
| --------------------- | ---------------------- | -------------------------------------------- |
| **Unit**              | ~70%                   | `server/test/unit`, `apps/web/test/unit`     |
| **API / Integration** | ~20%                   | `server/test/api`, `server/test/integration` |
| **E2E**               | ~10%                   | `tests/e2e` (Chromium only)                  |

**Rules:** Prefer unit tests. Do not duplicate the same behavior across layers. Reserve E2E for critical user journeys only. Keep the suite fast, deterministic, and maintainable.

## Ownership

| Path             | Owns                                                    |
| ---------------- | ------------------------------------------------------- |
| `tests/`         | Shared fixtures, factories, mocks, helpers; **all E2E** |
| `server/test/`   | Nest unit, integration, API (Supertest)                 |
| `apps/web/test/` | Frontend unit only                                      |

## Principles

- Behavior over implementation
- Deterministic tests
- No external services on the default path
- No shared mutable state
- Prefer DI over monkey patching
- One behavior per test

## Commands

From monorepo root:

```bash
pnpm test:unit          # server + web unit (Jest)
pnpm test:api           # Nest Supertest API smoke
pnpm test:integration   # optional; describe.skip without TEST_* URLs
pnpm test:e2e           # Playwright Chromium only
pnpm test:cov           # unit coverage (informational ≥60% target; no hard gate)
```

Package-local:

```bash
pnpm --filter @project-genesis/server test:unit
pnpm --filter @project-genesis/server test:api
pnpm --filter @project-genesis/web test:unit
```

There is **no root Jest config** — root scripts delegate to package configs (`server/test/jest-*.cjs`, `apps/web/test/jest.config.cjs`). Server projects share `server/test/jest.shared.cjs`.

## Optional integration env

```bash
# .env or shell — not required for unit/api/e2e defaults
TEST_DATABASE_URL=mongodb://localhost:27017/project-genesis-test
TEST_REDIS_URL=redis://localhost:6379/15
```

No Docker or Testcontainers in M9.
