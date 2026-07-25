# Project Genesis Architecture

> **Canonical Architecture Documentation**
>
> Version: **1.1**
>
> Status: **FROZEN**
>
> Last Updated: 2026-07-25
>
> Amendment: [ADR-001](../02-adr/001-nestjs-backend-nextjs-frontend.md) (NestJS API + Next.js UI split)

---

# Purpose

This folder contains the complete architecture, design specifications, implementation specifications, and execution roadmap for **Project Genesis**.

These documents collectively define the canonical architecture of the platform.

All implementation must follow these documents.

---

# Architecture Status

✅ Architecture Complete

✅ Specifications Complete

✅ Implementation Roadmap Complete

**Architecture Version:** 1.1

**Status:** Frozen

No architectural changes should be made during implementation unless absolutely necessary.

If a change becomes necessary, create an Architecture Decision Record (ADR) before modifying the architecture.

---

# Documentation Structure

The documentation is organized into four major phases.

---

## Phase 1 — Product & System Design

These documents describe **what the platform is**.

| # | Document | Purpose |
|---|----------|---------|
| 01 | Project Goal | Vision, objectives, scope |
| 02 | Tech Stack | Technology decisions |
| 03 | Product Requirements | Functional & non-functional requirements |
| 04 | System Concepts | Core architectural concepts |
| 05 | User Flows | End-to-end user journeys |
| 06 | Information Architecture | Content organization |
| 07 | Domain Model | Business entities and relationships |
| 08 | Database Design | Database architecture |
| 09 | API Design | REST API conventions |
| 10 | Architecture | Overall system architecture |
| 11 | Folder Structure | Repository organization |
| 12 | Security Design | Security architecture |
| 13 | Coding Standards | Development conventions |
| 14 | Testing Strategy | Testing philosophy |
| 15 | Deployment & DevOps | Infrastructure and deployment |

---

## Phase 2 — Implementation Specifications

These documents describe **how every layer must be implemented**.

| # | Document |
|---|----------|
| 16 | Mongoose Schema Specification |
| 17 | Repository Specification |
| 18 | Service Specification |
| 19 | API Controller Specification |
| 20 | AI Provider Specification |
| 21 | AI Prompt Engine Specification |
| 22 | Storage Provider Specification |
| 23 | Queue & Worker Specification |
| 24 | Search & Indexing Specification |
| 25 | Frontend API Client Specification |
| 26 | Domain Events Specification |
| 27 | Testing Implementation Specification |
| 28 | Observability & Monitoring Specification |

---

## Phase 3 — Execution

These documents define **how the project is built**.

| # | Document |
|---|----------|
| 29 | Implementation Roadmap |
| 30 | Project Skeleton |
| — | [ARCHITECTURE-SYNC-CHANGELOG-1.1.md](./ARCHITECTURE-SYNC-CHANGELOG-1.1.md) |

---

# Reading Order

For a new developer joining the project, the recommended reading order is:

1. Project Goal
2. Product Requirements
3. System Architecture
4. Domain Model
5. Database Design
6. API Design
7. Security Design
8. Coding Standards
9. Service Specification
10. Repository Specification
11. API Controller Specification
12. Queue & Worker Specification
13. Domain Events Specification
14. Testing Specification
15. Observability Specification
16. Implementation Roadmap

---

# Development Principles

Every implementation must follow these principles:

- Architecture First
- Service-Oriented Business Logic
- Thin Controllers
- Repository Pattern
- Provider Abstraction
- Dependency Injection
- SOLID Principles
- Clean Architecture
- Strict Type Safety
- Testability
- Observability by Default
- Security by Design

---

# Implementation Rules

All new features must follow the same implementation order:

Database Schema

↓

Repository

↓

Service

↓

Domain Events

↓

Queue Worker (if required)

↓

API Controller

↓

Frontend API Client

↓

Frontend UI

↓

Unit Tests

↓

Integration Tests

↓

End-to-End Tests

↓

Architecture Review

Do not skip layers.

Do not bypass services.

Do not move business logic into controllers or repositories.

---

# Architecture Decision Policy

Architecture Version **1.1** is considered **Frozen**. ADR-001 records the canonical split: Next.js App Router UI in `apps/web`, NestJS REST API and NestJS Workers in `server/`.

Implementation should adapt to the architecture—not the other way around.

If a design change is unavoidable:

1. Create an ADR (Architecture Decision Record).
2. Document the rationale.
3. Evaluate system-wide impact.
4. Review affected specifications.
5. Update documentation only after approval.

---

# Definition of Done

A feature is considered complete only when:

- Architecture is respected.
- Business logic resides in Services.
- Repository layer contains persistence only.
- Controllers remain thin.
- Validation is implemented.
- Tests pass.
- Logging and metrics are included.
- Security has been reviewed.
- Documentation is updated (if required).
- Code review is completed.

---

# Repository Structure

```text
project-genesis/
│
├── README.md
├── apps/
│   └── web/                 # Next.js App Router UI only
├── server/                  # NestJS REST API and NestJS Workers
├── packages/
├── docker/
├── scripts/
├── docs/
│   ├── 00-architecture/
│   ├── 01-epics/
│   ├── 02-adr/
│   └── 03-assets/
└── .github/
```

---

# Related Documentation

- `../01-epics/` → Feature implementation plans.
- `../02-adr/` → Architecture Decision Records.
- `../03-assets/` → Diagrams, exported PDFs, and supporting assets.

---

# Final Note

This documentation represents the **single source of truth** for Project Genesis.

During implementation:

- Follow the architecture.
- Avoid introducing undocumented patterns.
- Keep modules loosely coupled.
- Maintain consistency across all layers.
- Prefer extending the existing architecture over redesigning it.

Architecture **Version 1.1** is considered complete and serves as the foundation for all future development.