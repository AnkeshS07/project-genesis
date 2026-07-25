# Project Genesis - Phase 0 Bootstrap

You are a Principal Software Architect and Senior Full Stack Engineer.

Your task is to bootstrap the complete Project Genesis codebase.

This is NOT feature implementation.

This is infrastructure setup only.

The architecture has already been finalized.

DO NOT redesign anything.

Use every architecture document as the source of truth.

Architecture Version: 1.1. The monorepo uses `apps/web` for the Next.js UI only and `server/` for the NestJS REST API and NestJS Workers. Domain APIs must not be implemented as Next.js Route Handlers.

---

# Source Documents

Use ONLY these documents as references:

01-project-goal.md
02-tech-stack.md
03-product-requirements.md
04-system-concepts.md
05-user-flows.md
06-information-architecture.md
07-domain-model.md
08-database-design.md
09-api-design.md
10-architecture.md
11-folder-structure.md
12-security-design.md
13-coding-standards.md
14-testing-strategy.md
15-deployment-devops.md
16-mongoose-schema-spec.md
17-repository-spec.md
18-service-spec.md
19-api-controller-spec.md
20-ai-provider-spec.md
21-ai-prompt-engine-spec.md
22-storage-provider-spec.md
23-queue-worker-spec.md
24-search-indexing-spec.md
25-frontend-api-client-spec.md
26-domain-events-spec.md
27-testing-implementation-spec.md
28-observability-monitoring-spec.md
29-implementation-roadmap.md

Treat these documents as immutable.

---

# Goal

Bootstrap the entire repository.

No business features.

No CRUD.

No APIs.

No authentication.

No AI.

No storage implementation.

Only project infrastructure.

---

# Create Repository Structure

Create the complete folder structure.

Example:

apps/
    web/

server/
    src/
        app/
        common/
        config/
        modules/
        repositories/
        services/
        providers/
            ai/
            storage/
            search/
        workers/
        events/
        middleware/
        guards/
        interceptors/
        pipes/
        filters/
        jobs/
        scheduler/
        utils/
        database/
        telemetry/
        auth/

packages/
    shared/
    sdk/
    types/

docs/

docker/

scripts/

.github/

---

# Configure Backend

Create:

NestJS REST API in `server/`

TypeScript

ESLint

Prettier

Husky

lint-staged

Docker

Docker Compose

Environment configuration

Configuration module

Validation

Logger abstraction

Exception filters

Validation pipes

Global interceptors

Health module

Swagger configuration

Testing configuration

Jest + Supertest test configuration

---

# Configure Frontend

Create:

Next.js latest

React latest

TypeScript

App Router

UI only; consume the NestJS REST API and do not create business API Route Handlers

TanStack Query

React Hook Form

Zod

TailwindCSS

ESLint

Prettier

Folder structure

Theme provider

Authentication provider

API client placeholder

Error boundaries

Loading states

Route groups

---

# Configure Database

Setup:

MongoDB connection

Redis connection

Configuration

Indexes placeholder

Repository base classes

Transaction utilities

No schemas yet.

---

# Configure Providers

Create provider abstractions only.

AI Provider interface

Storage Provider interface

Search Provider interface

No implementations.

---

# Configure Queue

Create:

NestJS Workers + BullMQ configuration

Queue registry

Worker registry

Job registry

No jobs.

---

# Configure Observability

Create placeholders for:

Logging

Metrics

Tracing

Health checks

Audit logging

No vendor integration yet.

---

# Configure Testing

Setup:

Jest

Testing utilities

Factories folder

Fixtures folder

Mock providers

Integration test structure

E2E structure

---

# Configure CI/CD

Create:

GitHub Actions

Lint workflow

Test workflow

Build workflow

Security scan placeholder

Release workflow placeholder

---

# Configure Docker

Create:

Development

Production

Mongo

Redis

Nginx placeholder

Volumes

Networks

---

# Configure Shared Packages

shared/

types/

sdk/

constants/

utilities/

validators/

---

# Coding Standards

Every generated file must follow:

Dependency Injection

SOLID

Clean Architecture

No circular dependencies

Strict typing

No any

No magic strings

No duplicated code

---

# Do NOT Create

Authentication

Users

Projects

Stories

Characters

Worlds

Assets

Prompt Templates

Generations

Search

Exports

Notifications

Repositories

Services

Controllers

Schemas

CRUD

Business Logic

---

# Deliverables

Generate:

Complete folder structure

Configuration files

Boilerplate

Base classes

Interfaces

Abstract classes

Dependency Injection setup

Tooling

Build system

Docker

CI/CD

Testing infrastructure

Everything required so implementation of Epic 1 can begin immediately.

No business functionality.

The project must compile successfully.

The project must pass linting.

The project must pass formatting.

The project must build successfully.

The project should be production-ready from an infrastructure perspective.