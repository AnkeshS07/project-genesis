# Epic 00 — Project Bootstrap — Tasks

> Status: **In Progress (M5 complete)**

---

# Task Rules

- Infrastructure only — no product features
- Follow Architecture Version 1.1 as source of truth
- Do not redesign architecture
- Project must compile, lint, format, and build when complete

---

# 1. Repository Initialization

- [x] Initialize monorepo / repository root
- [x] Create root `README.md` for the application codebase
- [x] Create `.gitignore`
- [x] Create `.env.example`
- [x] Create package manager configuration (`pnpm` per architecture)
- [x] Create TypeScript base configuration
- [x] Create ESLint configuration
- [x] Create Prettier configuration
- [x] Configure Husky
- [x] Configure lint-staged

---

# 2. Folder Structure

- [x] Create `apps/web/` (frontend)
- [x] Create backend `server/` structure per skeleton
- [x] Create `packages/shared/`
- [x] Create `packages/sdk/`
- [x] Create `packages/types/`
- [x] Create `docker/`
- [x] Create `scripts/`
- [x] Create `.github/`
- [x] Ensure docs remain under `docs/` (architecture, epics, ADR, assets)

---

# 3. Backend Bootstrap

- [x] Initialize NestJS + TypeScript
- [x] Configure Configuration module
- [x] Configure environment validation
- [x] Create Logger abstraction
- [x] Create Exception filters
- [x] Create Validation pipes
- [x] Create Global interceptors
- [x] Create Health module
- [x] Configure Swagger placeholder
- [ ] Configure testing setup for backend
- [ ] Configure Jest and Supertest for NestJS backend tests

---

# 4. Frontend Bootstrap

- [x] Initialize Next.js (App Router) + React + TypeScript
- [x] Keep `apps/web` UI-only; do not create Next.js business API Route Handlers
- [x] Configure Tailwind CSS
- [x] Configure TanStack Query
- [ ] Configure React Hook Form + Zod
- [x] Configure ESLint / Prettier for frontend
- [ ] Create folder structure (features, components, hooks, etc. placeholders)
- [x] Create Theme provider placeholder
- [ ] Create Authentication provider placeholder (no auth logic)
- [x] Create API client placeholder
- [x] Create Error boundaries / loading states / route groups placeholders

---

# 5. Database & Cache Configuration

- [x] Configure MongoDB connection
- [x] Configure Redis connection
- [ ] Create repository base classes _(deferred — not in M5 scope; connectivity only)_
- [ ] Create transaction utilities _(deferred — not in M5 scope)_
- [ ] Create indexes placeholder _(deferred — not in M5 scope)_
- [x] Do **not** create domain schemas yet

---

# 6. Provider Abstractions Interfaces

- [ ] Create AI Provider interface
- [ ] Create Storage Provider interface
- [ ] Create Search Provider interface
- [ ] Create provider factory placeholders
- [ ] Do **not** implement concrete providers yet

---

# 7. Queue Infrastructure

- [ ] Configure BullMQ
- [ ] Create Queue registry
- [ ] Create Worker registry
- [ ] Create Job registry
- [ ] Do **not** register business jobs yet

---

# 8. Observability Placeholders

- [x] Logging placeholder
- [ ] Metrics placeholder
- [ ] Tracing placeholder
- [x] Health checks
- [ ] Audit logging placeholder
- [ ] Do **not** integrate vendors yet

---

# 9. Testing Infrastructure

- [ ] Configure Jest unit and integration test runner
- [ ] Create factories folder
- [ ] Create fixtures folder
- [ ] Create mock providers folder
- [ ] Create integration test structure
- [ ] Create E2E test structure
- [ ] Add sample smoke/bootstrap tests that pass

---

# 10. Docker

- [ ] Create development Docker setup
- [ ] Create production Docker placeholder
- [ ] Add MongoDB service
- [ ] Add Redis service
- [ ] Add `web`, `api` (NestJS REST), and `worker` (NestJS Workers + BullMQ) services
- [ ] Configure volumes and networks
- [ ] Add Nginx placeholder (optional/future-ready)

---

# 11. CI/CD

- [ ] Create GitHub Actions lint workflow
- [ ] Create test workflow
- [ ] Create build workflow
- [ ] Create security scan placeholder
- [ ] Create release workflow placeholder

---

# 12. Shared Packages

- [ ] Bootstrap `packages/shared` (constants, utilities, validators placeholders)
- [ ] Bootstrap `packages/types`
- [ ] Bootstrap `packages/sdk` placeholder
- [ ] Wire workspace references

---

# 13. Verification

- [ ] Project compiles
- [ ] Lint passes
- [ ] Format check passes
- [ ] Tests pass
- [ ] Docker starts
- [ ] MongoDB connects
- [ ] Redis connects
- [ ] Backend starts
- [ ] Frontend starts
- [ ] CI pipeline succeeds
- [ ] Folder structure matches architecture

---

# Explicitly Do Not Implement

- Authentication / Users / Workspaces / Projects
- Characters / Worlds / Stories / Chapters / Scenes
- Assets / Prompt Templates / Generations
- Search / Export / Notifications
- Domain repositories, services, controllers, schemas
- CRUD / NestJS business APIs / business logic
- Next.js business API Route Handlers
