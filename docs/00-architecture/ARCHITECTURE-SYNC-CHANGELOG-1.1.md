# Architecture Synchronization Change Log

**Date:** 2026-07-25  
**Resulting version:** Architecture **1.1**  
**Trigger:** Standardize on NestJS REST API + NestJS Workers, Next.js UI-only, Jest/Supertest/Playwright, pnpm monorepo (`apps/web`, `server`, `packages`, …)  
**Related ADR:** [ADR-001 — NestJS Backend and Next.js Frontend Split](../02-adr/001-nestjs-backend-nextjs-frontend.md)

---

## Summary

Removed contradictions between Architecture 1.0 documents that described Next.js Route Handlers as the API host / Vitest as the unit test runner / a single-app folder tree, and later bootstrap documents that assumed NestJS + `apps/web` + Jest.

Original intent preserved: layered architecture, thin controllers, service-owned business logic, repository persistence, provider abstractions, MongoDB as source of truth, Redis + BullMQ async work, security/testing/devops discipline.

---

## Modified documents

| Document | What changed | Why |
|----------|--------------|-----|
| `docs/02-adr/001-nestjs-backend-nextjs-frontend.md` | **Created** Accepted ADR recording NestJS API/workers, Next.js UI-only, Jest, monorepo | Canonical decision record; supersedes Route-Handler-as-API wording |
| `docs/02-adr/README.md` | Indexed ADR-001 | Discoverability |
| `docs/00-architecture/02-tech-stack.md` | NestJS backend; Next.js UI-only; Jest/Supertest; monorepo tree; split deploy | Tech stack was primary contradiction source |
| `docs/00-architecture/09-api-design.md` | NestJS REST host at `/api/v1`; NestJS Controllers; UI-only Next.js | Align API contract host with NestJS |
| `docs/00-architecture/10-architecture.md` | Diagrams/lifecycles/folder ownership use NestJS Controllers & workers | System blueprint still showed Route Handlers |
| `docs/00-architecture/11-folder-structure.md` | Rewrote to `apps/web` + `server` + `packages` monorepo | Old single-app tree conflicted with canonical repo |
| `docs/00-architecture/13-coding-standards.md` | NestJS standards; Next.js UI-only; Jest | Coding rules referenced Route Handlers / wrong test runner |
| `docs/00-architecture/14-testing-strategy.md` | Vitest → Jest; Supertest + Playwright retained/clarified | Testing Final stack mismatched decision |
| `docs/00-architecture/15-deployment-devops.md` | Split web / api / worker hosting & Docker services | Deploy doc assumed Next.js hosted APIs |
| `docs/00-architecture/17-repository-spec.md` | “Route Handlers” → NestJS Controllers / HTTP layer | Terminology sync |
| `docs/00-architecture/18-service-spec.md` | Forbidden HTTP coupling updated to NestJS Controller/HTTP objects | Terminology + boundary sync |
| `docs/00-architecture/19-api-controller-spec.md` | Retitled/reworded to NestJS Controllers; authoring guards clarified | Spec branded Route Handlers |
| `docs/00-architecture/23-queue-worker-spec.md` | Explicit NestJS Workers + BullMQ + Redis | Workers runtime was underspecified |
| `docs/00-architecture/27-testing-implementation-spec.md` | Clarified “no Jest code in spec” ≠ product forbids Jest; product uses Jest | Misleading authoring guard |
| `docs/00-architecture/29-implementation-roadmap.md` | Clarified “no NestJS code in roadmap doc”; product uses NestJS; layer names updated | Misleading authoring guard |
| `docs/00-architecture/30-project-skeleton.md` | Canonical monorepo; NestJS API/workers; Jest; UI-only Next.js | Align bootstrap instructions with 1.1 |
| `docs/00-architecture/README.md` | Version 1.1, ADR-001, monorepo structure, freeze note | Entry point must state current truth |
| `docs/README.md` | Version 1.1 + canonical runtime shape | Docs index sync |
| `README.md` (repo root) | Architecture 1.1; monorepo tree; NestJS API; Next UI-only; Jest | Project entrypoint sync |
| `docs/01-epics/00-project-bootstrap/README.md` | NestJS REST/workers; Next UI-only; 1.1 | Epic must match architecture |
| `docs/01-epics/00-project-bootstrap/tasks.md` | Jest; UI-only guardrails; web/api/worker Docker | Bootstrap tasks must match 1.1 |
| `docs/01-epics/00-project-bootstrap/checklist.md` | Monorepo structure; Jest; no Next business APIs | Completion criteria sync |
| `docs/01-epics/00-project-bootstrap/review.md` | Review matrix for NestJS/Jest/monorepo | Review gate sync |

| `docs/00-architecture/20-ai-provider-spec.md` | Architecture Version stamp → 1.1 | Version consistency under ADR-001 |
| `docs/00-architecture/21-ai-prompt-engine-spec.md` | Architecture Version stamp → 1.1 | Version consistency under ADR-001 |
| `docs/00-architecture/22-storage-provider-spec.md` | Architecture Version stamp → 1.1 | Version consistency under ADR-001 |
| `docs/00-architecture/24-search-indexing-spec.md` | Architecture Version stamp → 1.1 | Version consistency under ADR-001 |
| `docs/00-architecture/25-frontend-api-client-spec.md` | Architecture Version stamp → 1.1 | Version consistency under ADR-001 |
| `docs/00-architecture/26-domain-events-spec.md` | Architecture Version stamp → 1.1 | Version consistency under ADR-001 |
| `docs/00-architecture/28-observability-monitoring-spec.md` | Architecture Version stamp → 1.1 | Version consistency under ADR-001 |
| `docs/00-architecture/ARCHITECTURE-SYNC-CHANGELOG-1.1.md` | **Created** this change log | Traceability |

---

## Intentionally unchanged in substance (no host/test/tree conflict)

Product/domain docs that did not prescribe Next.js Route Handlers or Vitest as API/test host:

- `01-project-goal.md`
- `03-product-requirements.md`
- `04-system-concepts.md`
- `05-user-flows.md`
- `06-information-architecture.md`
- `07-domain-model.md`
- `08-database-design.md`
- `12-security-design.md` (framework-agnostic controls)
- `16-mongoose-schema-spec.md` (no version stamp / no host conflict found)

---

## Remaining mentions of “Route Handlers” / “Vitest”

These remain **on purpose** as historical supersession notes or **prohibitions**:

- ADR-001 explains what was superseded and that Vitest was replaced by Jest
- Multiple docs explicitly forbid implementing domain APIs as Next.js Route Handlers

They are not prescriptions to use Route Handlers or Vitest.
