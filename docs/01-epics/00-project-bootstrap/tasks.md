# Epic 00 — Project Bootstrap — Tasks

> Status: **Complete (M0–M12 closed)**

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
- [x] Configure testing setup for backend
- [x] Configure Jest and Supertest for NestJS backend tests

---

# 4. Frontend Bootstrap

- [x] Initialize Next.js (App Router) + React + TypeScript
- [x] Keep `apps/web` UI-only; do not create Next.js business API Route Handlers
- [x] Configure Tailwind CSS
- [x] Configure TanStack Query
- [ ] Configure React Hook Form + Zod _(deferred → Epic 01)_
- [x] Configure ESLint / Prettier for frontend
- [ ] Create folder structure (features, components, hooks, etc. placeholders) _(deferred — create with first feature)_
- [x] Create Theme provider placeholder
- [ ] Create Authentication provider placeholder (no auth logic) _(deferred → Epic 01)_
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

- [x] Create AI Provider interface
- [x] Create Storage Provider interface
- [x] Create Search Provider interface
- [x] Create provider factory placeholders
- [x] Do **not** implement concrete providers yet

---

# 7. Queue Infrastructure

- [x] Configure BullMQ
- [x] Create Queue registry
- [x] Create Worker registry
- [x] Create Job registry
- [x] Do **not** register business jobs yet

---

# 8. Observability Placeholders

- [x] Logging placeholder
- [x] Metrics placeholder
- [x] Tracing placeholder
- [x] Health checks
- [x] Audit logging placeholder
- [x] Do **not** integrate vendors yet

---

# 9. Testing Infrastructure

- [x] Configure Jest unit and integration test runner
- [x] Create factories folder
- [x] Create fixtures folder
- [x] Create mock providers folder
- [x] Create integration test structure
- [x] Create E2E test structure
- [x] Add sample smoke/bootstrap tests that pass

---

# 10. Docker

- [x] Create development Docker setup
- [x] Create production Docker placeholder
- [x] Add MongoDB service
- [x] Add Redis service
- [x] Add `web`, `api` (NestJS REST), and `worker` (NestJS Workers + BullMQ) services
- [x] Configure volumes and networks
- [x] Add Nginx placeholder (optional/future-ready)

---

# 11. CI/CD

- [x] Create GitHub Actions lint workflow (`.github/workflows/ci.yml` job `lint`)
- [x] Create test workflow (unit, API, optional integration; E2E + coverage on `main`)
- [x] Create build workflow (Docker image verify for api/worker/web + Compose config)
- [x] Security scan placeholder — **deferred** (no enforcing scanners in M11; out of scope)
- [x] Release workflow placeholder — **deferred** (no deploy/release automation in M11; out of scope)

---

# 12. Shared Packages

- [x] Bootstrap `packages/shared` (constants, utilities, validators placeholders)
- [x] Bootstrap `packages/types`
- [x] Bootstrap `packages/sdk` placeholder
- [x] Wire workspace references

---

# 13. Verification

- [x] Project compiles
- [x] Lint passes
- [x] Format check passes
- [x] Tests pass
- [x] Docker starts
- [x] MongoDB connects
- [x] Redis connects
- [x] Backend starts
- [x] Frontend starts
- [x] CI pipeline defined (confirm remote Actions after push)
- [x] Folder structure matches architecture

---

# Explicitly Do Not Implement

- Authentication / Users / Workspaces / Projects
- Characters / Worlds / Stories / Chapters / Scenes
- Assets / Prompt Templates / Generations
- Search / Export / Notifications
- Domain repositories, services, controllers, schemas
- CRUD / NestJS business APIs / business logic
- Next.js business API Route Handlers
