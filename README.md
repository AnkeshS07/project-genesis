# Project Genesis

> **AI-First Creative Operating Platform**
>
> Architecture Version: **1.1**
>
> Status: **Architecture Frozen**
>
> Development Phase: **Implementation**

---

# Overview

Project Genesis is an AI-first platform designed to help creators plan, write, organize, generate, manage, and publish creative content.

The platform is built using a layered architecture with strict separation of responsibilities, provider abstraction, event-driven workflows, background processing, and production-grade operational practices.

The architecture has been fully documented before implementation to ensure consistency, scalability, maintainability, and long-term evolution.

---

# Application Monorepo (Getting Started)

Architecture Version **1.1** uses a pnpm monorepo. Application packages (`apps/web`, `server`, `packages/*`) are added in later Epic 00 milestones. Milestone **M1** establishes root tooling only.

## Prerequisites

- Node.js `>= 20` (see `.nvmrc`)
- [pnpm](https://pnpm.io) `9+` (repo pins `packageManager` in `package.json`)

## Install

```bash
pnpm install
```

## Root scripts

```bash
pnpm install
pnpm lint
pnpm format:check
pnpm build
pnpm typecheck
```

## Workspace packages (M2+)

| Package                   | Path              | Role                           |
| ------------------------- | ----------------- | ------------------------------ |
| `@project-genesis/web`    | `apps/web`        | Next.js UI Shell complete (M4) |
| `@project-genesis/server` | `server`          | NestJS API Core complete (M3)  |
| `@project-genesis/types`  | `packages/types`  | Shared types                   |
| `@project-genesis/shared` | `packages/shared` | Shared utilities               |
| `@project-genesis/sdk`    | `packages/sdk`    | Frontend API client stub       |

## Environment

Copy `.env.example` to `.env` for local overrides. Never commit real secrets.

## Workspace layout (target)

```text
apps/web      → Next.js UI only (M4+)
server        → NestJS API + workers (M3+)
packages/*    → shared, types, sdk (M2+)
docs/         → architecture & epics (already present)
```

---

# Repository Structure

```text
project-genesis/
│
├── README.md
│
├── apps/
│   └── web/                    # Next.js App Router UI only
│
├── server/                      # NestJS REST API and NestJS Workers
│
├── packages/
├── docker/
├── scripts/
├── .github/
│
└── docs/
    │
    ├── 00-architecture/
    │    ├── README.md
    │    ├── 01 ... 30.md
    │
    ├── 01-epics/
    │    ├── 00-project-bootstrap/
    │    ├── 01-authentication/
    │    ├── 02-users/
    │    ├── 03-workspaces/
    │    ├── 04-projects/
    │    ├── 05-characters/
    │    ├── 06-worlds/
    │    ├── 07-story-bible/
    │    ├── 08-stories/
    │    ├── 09-chapters/
    │    ├── 10-scenes/
    │    ├── 11-assets/
    │    ├── 12-ai-prompt-templates/
    │    ├── 13-ai-generation/
    │    ├── 14-storage/
    │    ├── 15-search/
    │    ├── 16-export/
    │    ├── 17-notifications/
    │    ├── 18-analytics/
    │    ├── 19-admin/
    │    ├── 20-billing/
    │    ├── 21-settings/
    │    └── 22-production-hardening/
    │
    ├── 02-adr/
    └── 03-assets/
```

---

# Documentation Guide

## docs/00-architecture/

Contains the complete architecture and implementation specifications.

This folder is considered the **single source of truth**.

Read this before writing any code.

👉 Start here:

```
docs/00-architecture/README.md
```

---

## docs/01-epics/

Contains implementation plans for each feature.

Every feature is implemented as an independent Epic.

Each Epic contains its own:

- Objectives
- Tasks
- API Notes
- Checklist
- Architecture Review
- Completion Criteria

---

## docs/02-adr/

Architecture Decision Records (ADRs).

Use this folder whenever a significant architectural decision needs to be documented after Architecture v1.1. ADR-001 defines the canonical NestJS backend and Next.js UI split.

Architecture should not be changed without an ADR.

---

## docs/03-assets/

Supporting project resources.

Examples:

- Architecture diagrams
- ER diagrams
- Sequence diagrams
- UI mockups
- Screenshots
- Exported PDFs

---

# Development Workflow

Every feature follows the same implementation lifecycle:

```text
Architecture

↓

Epic Planning

↓

Schema

↓

Repository

↓

Service

↓

Domain Events

↓

Queue Worker

↓

API Controller

↓

Frontend API

↓

Frontend UI

↓

Testing

↓

Architecture Review

↓

Merge
```

---

# Development Principles

Every contribution should follow these principles:

- Architecture First
- Clean Architecture
- SOLID Principles
- Repository Pattern
- Service-Oriented Business Logic
- Provider Abstraction
- Dependency Injection
- Strict Type Safety
- Security by Design
- Observability by Default
- Testability
- Scalability

---

# Architecture Status

Current Version:

```
Version 1.1
```

Status:

```
Frozen
```

Architecture changes should be rare.

If a change is required:

1. Create an ADR.
2. Document the reason.
3. Review the impact.
4. Update affected documents.
5. Proceed with implementation only after approval.

---

# Implementation Status

| Phase               | Status      |
| ------------------- | ----------- |
| Product Planning    | ✅ Complete |
| Architecture        | ✅ Complete |
| Specifications      | ✅ Complete |
| Roadmap             | ✅ Complete |
| Project Bootstrap   | ⏳ Pending  |
| Feature Development | ⏳ Pending  |
| Testing             | ⏳ Pending  |
| Production          | ⏳ Pending  |

---

# Reading Order

For new developers:

1. README.md
2. docs/00-architecture/README.md
3. docs/00-architecture/29-implementation-roadmap.md
4. docs/01-epics/README.md
5. Current Epic

---

# Contribution Guidelines

Before submitting code:

- Follow the architecture.
- Keep business logic inside Services.
- Keep Controllers thin.
- Keep Repositories persistence-only.
- Write tests.
- Add logging where appropriate.
- Maintain documentation if behavior changes.
- Ensure lint, build, and tests pass.

---

# Technology Stack

### Frontend

- Next.js
- Next.js App Router UI only (no business API Route Handlers)
- React
- TypeScript
- Tailwind CSS
- TanStack Query

### Backend

- NestJS
- TypeScript
- MongoDB
- Redis
- BullMQ
- Jest + Supertest + Playwright

### Infrastructure

- Docker
- GitHub Actions
- CI/CD
- Structured Logging
- Monitoring
- Health Checks

---

# Project Philosophy

Project Genesis follows a simple philosophy:

> **Design carefully. Build incrementally. Validate continuously.**

The architecture defines **what** the platform should be.

The epics define **how** it is implemented.

Every implementation should strengthen the architecture—not work around it.

---

# Bootstrap Progress

**Bootstrap (Epic 00) — In Progress**

Completed:

- ✔ M0 Planning
- ✔ M1 Monorepo Tooling
- ✔ M2 Workspace Skeleton
- ✔ M3 NestJS API Core
- ✔ M4 Next.js UI Shell
- ✔ M5 MongoDB + Redis Infrastructure

Next: **M6** Provider abstraction interfaces

```
docs/01-epics/
    ↓
00-project-bootstrap  (in progress)
    ↓
01-authentication
```

---

**Project Genesis**  
Architecture Version **1.1** • Bootstrap (Epic 00) In Progress
