# Folder Structure

## Purpose

This document defines the standard folder structure for Project Genesis.

It specifies where every part of the application should live and the responsibility of each directory.

This structure is designed for scalability, maintainability, and feature-based development.

**Architecture Version:** 1.1  

**Related ADR:** [ADR-001 — NestJS Backend and Next.js Frontend Split](../02-adr/001-nestjs-backend-nextjs-frontend.md)

---

# Design Principles

The folder structure follows these principles:

* Feature First
* Separation of Concerns
* Framework Independent Business Logic
* Shared Components
* Reusable Modules
* Provider Abstraction
* Easy Navigation
* Easy Testing
* Scalable Architecture
* Clear process boundaries (web UI vs NestJS API vs NestJS workers)

---

# Project Structure

```text
project-genesis/
│
├── apps/
│   └── web/                 # Next.js App Router (UI only)
├── server/                  # NestJS REST API + NestJS workers
├── packages/
│   ├── shared/
│   ├── types/
│   └── sdk/
├── docker/
├── scripts/
├── docs/
│   ├── 00-architecture/
│   ├── 01-epics/
│   ├── 02-adr/
│   └── 03-assets/
├── .github/
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── .env.example
```

---

# Root Directory

The root contains workspace configuration and top-level tooling.

Responsibilities

* pnpm workspace configuration
* Shared TypeScript / ESLint / Prettier config
* Environment examples
* Documentation entrypoints

No business logic should exist here.

---

# apps/web/

Purpose

Contains the Next.js App Router **frontend UI only**.

Responsibilities

* Routes
* Layouts
* Pages
* UI error / loading states
* Client-side providers
* Calls to the NestJS API via SDK / API client

Does **not**

* Host business REST APIs
* Implement domain Next.js Route Handlers
* Access MongoDB
* Call AI / storage providers directly

Example

```text
apps/web/
│
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── dashboard/
│   ├── projects/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── features/
├── components/
├── hooks/
├── lib/
├── public/
├── middleware.ts            # UI concerns only (e.g. redirects); not business API
├── next.config.ts
└── package.json
```

Rules

* No business logic in UI components or pages.
* No database queries.
* Communicate with NestJS REST API only.

---

# apps/web/features/

Purpose

Feature-specific frontend modules.

Example features: `auth`, `dashboard`, `project`, `character`, `world`, `story`, `scene`, `asset`, `prompt`, `generation`, `export`, `settings`.

Each feature may contain

```text
feature/
│
├── components/
├── hooks/
├── services/          # frontend API wrappers only
├── types/
├── validations/
├── utils/
└── index.ts
```

Rules

* Features should not depend on each other directly.
* Shared UI belongs in `apps/web/components/`.
* Shared non-UI logic belongs in `packages/shared` or `apps/web/lib/`.

---

# apps/web/components/

Purpose

Reusable UI components (pure UI only; no business logic).

Examples: `ui/`, `forms/`, `layouts/`, `navigation/`, `dialogs/`, `tables/`, `cards/`, `feedback/`, `icons/`.

---

# server/

Purpose

Contains the NestJS backend: REST API, domain services, repositories, providers, and NestJS workers.

Example

```text
server/
│
├── src/
│   ├── app/
│   ├── common/
│   ├── config/
│   ├── modules/
│   ├── controllers/          # or module-local controllers
│   ├── services/
│   ├── repositories/
│   ├── providers/
│   │   ├── ai/
│   │   ├── storage/
│   │   └── search/
│   ├── workers/              # NestJS workers
│   ├── events/
│   ├── jobs/
│   ├── middleware/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   ├── filters/
│   ├── database/
│   ├── telemetry/
│   ├── auth/                 # auth module placeholders / implementation
│   └── main.ts               # API bootstrap
├── test/
└── package.json
```

Rules

* Controllers are thin NestJS Controllers.
* Business logic lives in Services.
* Persistence lives in Repositories.
* External systems go through provider abstractions.
* Long-running work runs in NestJS Workers via BullMQ.

---

# server Controllers

Purpose

NestJS HTTP entry points for REST APIs (`/api/v1/...`).

Responsibilities

* Parse request
* Validate request
* Call Service
* Return response

Never

* Execute business rules
* Access MongoDB directly

---

# server Services

Purpose

Business logic.

Responsibilities

* Business rules
* Workflow orchestration
* Transactions
* Permission checks
* Job enqueueing

Never

* Know NestJS HTTP Request/Response details
* Access MongoDB except through repositories
* Call provider SDKs without abstractions

---

# server Repositories

Purpose

Database access only.

Rules

* Database queries only.
* No business logic.
* No HTTP / controller awareness.

---

# server Providers

Purpose

External provider implementations and interfaces (AI, storage, search, email, notification, analytics).

---

# server Workers & Jobs

Purpose

NestJS Workers and BullMQ job definitions.

Examples

* generation worker / job
* export worker / job
* upload worker / job
* cleanup worker / job

Workers orchestrate background execution; business rules remain in Services.

---

# packages/

Purpose

Shared libraries across web and server.

```text
packages/
├── shared/       # constants, utilities, validators
├── types/        # shared TypeScript types / DTOs
└── sdk/          # frontend HTTP SDK for NestJS API
```

---

# docker/

Purpose

Container definitions and Compose files for local and production-like runs.

Typical services

* `web` (Next.js)
* `api` (NestJS)
* `worker` (NestJS workers)
* `mongodb`
* `redis`

---

# scripts/

Purpose

Automation scripts (seed, cleanup, migrations, build helpers).

---

# docs/

Purpose

Project documentation (architecture, epics, ADRs, assets).

---

# .github/

Purpose

CI/CD workflows (lint, test, build, security/release placeholders).

---

# Testing Layout

Tests may live under package-local `test/` folders and/or a coordinated workspace test layout.

Recommended categories

* Unit (Jest)
* Integration (Jest)
* API (Jest + Supertest)
* E2E (Playwright)
* Fixtures / factories / mocks

---

# File Naming Conventions

Components

```text
PascalCase.tsx
```

Services

```text
kebab-case.service.ts
```

Repositories

```text
entity.repository.ts
```

Models / schemas

```text
entity.model.ts
```

NestJS controllers

```text
entity.controller.ts
```

Hooks

```text
useSomething.ts
```

---

# Import Rules

Allowed

```text
apps/web (UI)
        ↓
packages/sdk / packages/types / packages/shared
        ↓
NestJS Controllers
        ↓
Services
        ↓
Repositories
        ↓
Models / MongoDB
```

Not Allowed

* Repository → UI
* Model → Service (domain workflows)
* UI → Database
* UI → Provider SDKs
* Feature → Mongoose models
* NestJS Controller → Repository (bypass Service) for business operations

---

# Ownership Rules

| Location | Responsibility |
|----------|----------------|
| `apps/web` | Next.js UI only |
| `apps/web/features` | Frontend feature modules |
| `apps/web/components` | Shared UI |
| `server` | NestJS API, services, repositories, workers |
| `server` providers | External service adapters |
| `packages/shared` | Shared non-UI utilities |
| `packages/types` | Shared types |
| `packages/sdk` | Frontend API client |
| `docker` | Containerization |
| `scripts` | Automation |
| `docs` | Documentation |
| `.github` | CI/CD |

---

# Architecture Rules

* Keep frontend features isolated.
* Never place business logic inside UI components.
* Never access MongoDB outside repositories.
* Never call external providers directly from services without an abstraction.
* Never implement business REST APIs in Next.js.
* Store reusable logic in `packages/*` or shared server modules.
* Keep folders focused on a single responsibility.
* Avoid circular dependencies.
* Prefer composition over inheritance.
* Keep modules small and cohesive.
* Scale API and workers independently from the web app.

---

# Dependencies

## Depends On

* 01-project-goal.md
* 02-tech-stack.md
* 03-product-requirements.md
* 04-system-concepts.md
* 05-user-flows.md
* 06-information-architecture.md
* 07-domain-model.md
* 08-database-design.md
* 09-api-design.md
* 10-architecture.md
* ADR-001

## Used By

* Frontend Implementation
* Backend Implementation
* CI/CD Pipelines
* Code Reviews
* Engineering Guidelines
* Onboarding Documentation
* Epic 00 — Project Bootstrap
