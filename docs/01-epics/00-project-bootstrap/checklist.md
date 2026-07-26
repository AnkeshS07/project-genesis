# Epic 00 — Project Bootstrap — Checklist

> Status: **Complete (M0–M12 closed)**

Use this checklist before marking the Epic complete.

---

# Progress

| Category | Status |
|----------|--------|
| Planning | ✅ |
| Repository | ✅ |
| Backend | ✅ |
| Frontend | ✅ |
| Infrastructure | ✅ |
| Testing | ✅ |
| Docker | ✅ |
| CI/CD | ✅ |
| Review | ✅ |

---

# Planning

- [x] Architecture Version 1.1 reviewed
- [x] Implementation roadmap reviewed
- [x] Project skeleton (`30-project-skeleton.md`) reviewed
- [x] Scope and out-of-scope confirmed
- [x] No product features planned for this Epic

---

# Repository & Tooling

- [x] Repository initialized
- [x] `.gitignore` present
- [x] `.env.example` present
- [x] Package manager configured
- [x] TypeScript strict mode enabled
- [x] ESLint configured
- [x] Prettier configured
- [x] Husky configured
- [x] lint-staged configured

---

# Structure

- [x] `apps/web/` Next.js UI scaffold exists
- [x] `server/` NestJS API and worker scaffold exists
- [x] `packages/` shared workspace packages exist
- [x] Docker folder exists
- [x] Scripts folder exists
- [x] GitHub workflows folder exists
- [x] Folder structure matches architecture

---

# Backend

- [x] NestJS app boots
- [x] Config module works
- [x] Env validation works
- [x] Logger abstraction exists
- [x] Exception filters exist
- [x] Validation pipes exist
- [x] Health endpoint responds
- [x] Swagger placeholder configured

---

# Frontend

- [x] Next.js app boots
- [x] App Router configured
- [x] Tailwind configured
- [x] TanStack Query configured
- [ ] Zod / RHF placeholders configured _(deferred → Epic 01 forms/auth)_
- [x] API client placeholder exists
- [ ] Auth provider placeholder exists _(deferred → Epic 01)_
- [x] No Next.js business API Route Handlers exist

---

# Data & Infra Connections

- [x] MongoDB connection configured
- [x] Redis connection configured
- [ ] Repository base classes exist _(deferred — land with first domain epic)_
- [ ] Transaction utilities exist _(deferred)_
- [x] No domain schemas created

---

# Abstractions

- [x] AI provider interface exists
- [x] Storage provider interface exists
- [x] Search provider interface exists
- [x] No concrete provider implementations

---

# Queue

- [x] BullMQ configured
- [x] Queue registry exists
- [x] Worker registry exists
- [x] Job registry exists
- [x] No business jobs registered

---

# Observability

- [x] Health checks work
- [x] Logging placeholder exists
- [x] Metrics placeholder exists
- [x] Tracing placeholder exists
- [x] Audit logging placeholder exists

---

# Testing

- [x] Jest unit and integration test setup works
- [x] Integration test structure exists
- [x] E2E structure exists
- [x] Factories / fixtures / mocks folders exist
- [x] Bootstrap tests pass

---

# Docker & CI

- [x] Docker Compose starts required services
- [x] Docker Compose defines `web`, `api`, `worker`, `mongodb`, and `redis`
- [x] MongoDB reachable from app
- [x] Redis reachable from app
- [x] Lint workflow exists
- [x] Test workflow exists
- [x] Build workflow exists
- [x] CI workflow defined for main bootstrap state _(confirm remote Actions after push)_

---

# Quality Gates

- [x] Project compiles
- [x] Lint passes
- [x] Format check passes _(CI `format:check`)_
- [x] Tests pass
- [x] Backend starts
- [x] Frontend starts
- [x] Build succeeds

---

# Out-of-Scope Guardrails

- [x] No authentication implemented
- [x] No users / workspaces / projects APIs
- [x] No domain CRUD
- [x] No AI generation
- [x] No storage provider implementations
- [x] No business services / controllers / schemas

---

# Exit Criteria

- [x] All tasks in `tasks.md` completed or explicitly deferred with reason
- [x] `review.md` completed and approved
- [x] Ready to start Epic 01 — Authentication

---

# Next Epic

After this checklist is fully complete and the Architecture Review is approved:

➡️ Proceed to **Epic 01 — Authentication**
