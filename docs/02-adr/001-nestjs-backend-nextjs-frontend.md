# ADR-001 — NestJS Backend and Next.js Frontend Split

- **Status:** Accepted
- **Date:** 2026-07-25
- **Architecture Version:** 1.1
- **Supersedes:** Next.js Route Handlers as the application API host (Architecture 1.0 wording in tech stack, system architecture, folder structure, coding standards, and deployment docs)

---

## Context

Architecture Version 1.0 documented a layered creative platform with:

- Next.js for the user interface
- REST APIs
- MongoDB as source of truth
- Redis for cache/sessions/queues
- BullMQ for background work
- Provider abstractions for AI and storage
- Strict separation of controllers, services, and repositories

Some Version 1.0 documents placed the REST API inside **Next.js Route Handlers** in a single application tree. Later bootstrap and skeleton documents described a **NestJS** API with a separate Next.js frontend. That contradiction blocked safe implementation.

## Decision

Project Genesis standardizes on the following canonical architecture:

| Concern | Choice |
|---------|--------|
| Frontend | Next.js App Router (`apps/web`) — UI only |
| Backend / API | NestJS REST API (`server`) |
| Workers | NestJS Workers + BullMQ |
| Database | MongoDB (+ Mongoose) |
| Cache / queue broker | Redis |
| Package manager | pnpm |
| Unit / integration / API tests | Jest + Supertest |
| End-to-end tests | Playwright |

Canonical repository shape:

```text
project-genesis/
├── apps/
│   └── web/
├── server/
├── packages/
├── docker/
├── scripts/
├── docs/
└── .github/
```

**Next.js must not host business REST APIs.** Treat every document that describes Next.js Route Handlers as the application API layer as outdated and superseded by this ADR.

## Consequences

### Positive

- Clear process boundaries: UI, API, and workers can scale independently
- NestJS fits controllers, guards, pipes, modules, and DI already implied by the layered architecture
- Matches Epic 00 bootstrap and project skeleton intent
- Preserves original architectural intent (layers, providers, async jobs, MongoDB as truth)

### Negative / follow-up

- All Architecture 1.0 docs that referenced Route Handlers as APIs must be synchronized to 1.1
- Deployment must host NestJS API and workers separately from the Next.js web app (Vercel remains optional for frontend only)
- Testing standard moves from Vitest to Jest for unit/integration/API tests

## Compliance

Implementation and future epics must follow Architecture **1.1** as amended by this ADR.

If a further change is required, create a new ADR before modifying architecture documents.
