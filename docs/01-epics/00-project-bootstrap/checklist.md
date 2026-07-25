# Epic 00 — Project Bootstrap — Checklist

> Status: **In Progress (M5 complete)**

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
| Testing | ⬜ |
| Docker | ⬜ |
| CI/CD | ⬜ |
| Review | ⬜ |

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
- [ ] Zod / RHF placeholders configured
- [x] API client placeholder exists
- [ ] Auth provider placeholder exists (no auth logic)
- [x] No Next.js business API Route Handlers exist

---

# Data & Infra Connections

- [x] MongoDB connection configured
- [x] Redis connection configured
- [ ] Repository base classes exist _(deferred past M5 — milestone is connectivity only)_
- [ ] Transaction utilities exist _(deferred past M5)_
- [x] No domain schemas created

---

# Abstractions

- [ ] AI provider interface exists
- [ ] Storage provider interface exists
- [ ] Search provider interface exists
- [ ] No concrete provider implementations

---

# Queue

- [ ] BullMQ configured
- [ ] Queue registry exists
- [ ] Worker registry exists
- [ ] Job registry exists
- [ ] No business jobs registered

---

# Observability

- [x] Health checks work
- [ ] Logging placeholder exists
- [ ] Metrics placeholder exists
- [ ] Tracing placeholder exists
- [ ] Audit logging placeholder exists

---

# Testing

- [ ] Jest unit and integration test setup works
- [ ] Integration test structure exists
- [ ] E2E structure exists
- [ ] Factories / fixtures / mocks folders exist
- [ ] Bootstrap tests pass

---

# Docker & CI

- [ ] Docker Compose starts required services
- [ ] Docker Compose defines `web`, `api`, `worker`, `mongodb`, and `redis`
- [ ] MongoDB reachable from app
- [ ] Redis reachable from app
- [ ] Lint workflow exists
- [ ] Test workflow exists
- [ ] Build workflow exists
- [ ] CI passes on main bootstrap state

---

# Quality Gates

- [ ] Project compiles
- [ ] Lint passes
- [ ] Format check passes
- [ ] Tests pass
- [ ] Backend starts
- [ ] Frontend starts
- [ ] Build succeeds

---

# Out-of-Scope Guardrails

- [ ] No authentication implemented
- [ ] No users / workspaces / projects APIs
- [ ] No domain CRUD
- [ ] No AI generation
- [ ] No storage provider implementations
- [ ] No business services / controllers / schemas

---

# Exit Criteria

- [ ] All tasks in `tasks.md` completed or explicitly deferred with reason
- [ ] `review.md` completed and approved
- [ ] Ready to start Epic 01 — Authentication

---

# Next Epic

After this checklist is fully complete and the Architecture Review is approved:

➡️ Proceed to **Epic 01 — Authentication**
