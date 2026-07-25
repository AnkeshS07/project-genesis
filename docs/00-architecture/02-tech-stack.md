# Tech Stack

This document defines the approved technologies, architectural patterns, engineering standards, and development tools used throughout Project Genesis.

Its purpose is to maintain consistency, scalability, maintainability, and flexibility across the entire project lifecycle.

**Status:** Active  

**Architecture Version:** 1.1  

**Related ADR:** [ADR-001 — NestJS Backend and Next.js Frontend Split](../02-adr/001-nestjs-backend-nextjs-frontend.md)

---

# Frontend

Next.js is the **UI application only**. It does not host business REST APIs.

| Technology               | Status  | Purpose                                      |
| ------------------------ | ------- | -------------------------------------------- |
| Next.js 15+ (App Router) | ✅ Final | Frontend UI framework (`apps/web`)           |
| React 19                 | ✅ Final | User Interface                               |
| TypeScript               | ✅ Final | Type-safe development                        |
| Tailwind CSS             | ✅ Final | Utility-first CSS framework                  |
| shadcn/ui                | ✅ Final | Reusable UI component library                |
| React Hook Form          | ✅ Final | Form management                              |
| TanStack Query           | ✅ Final | Server state management & caching            |

---

# Backend

## Backend Principles

* NestJS hosts the application REST API.
* REST APIs are the primary communication layer.
* Long-running tasks must never block API requests.
* AI generation, media processing, notifications, and scheduled jobs run in NestJS background workers via BullMQ.

| Technology | Status  | Purpose                                       |
| ---------- | ------- | --------------------------------------------- |
| NestJS     | ✅ Final | REST API framework and worker runtime         |
| TypeScript | ✅ Final | Shared language across frontend & backend     |
| REST API   | ✅ Final | External integrations & future mobile support |

---

# Database

## Database Principles

* MongoDB is the primary source of truth.
* Mongoose is the official ODM.
* Every major domain entity has its own collection.
* References should be used where relationships exist.
* AI-generated content must always be linked to structured project data.
* Business data should never depend on AI provider responses.

| Technology    | Status  | Purpose                |
| ------------- | ------- | ---------------------- |
| MongoDB Atlas | ✅ Final | Primary database       |
| Mongoose      | ✅ Final | Object Document Mapper |

---

# Cache & Background Jobs

## Cache Principles

* Frequently accessed data should be cached.
* Background jobs should execute asynchronously.
* Queues should be retryable and fault tolerant.

| Technology | Status  | Purpose                           |
| ---------- | ------- | --------------------------------- |
| Redis      | ✅ Final | Cache, sessions & temporary state |
| BullMQ     | ✅ Final | Background jobs & queues          |

Workers are implemented as **NestJS Workers** consuming BullMQ jobs.

---

# File Storage

## Storage Strategy

Storage providers must never be accessed directly from business logic.

All file operations should pass through a centralized Storage Service.

Current implementation:

| Technology                  | Status        | Purpose           |
| --------------------------- | ------------- | ----------------- |
| Cloudflare R2               | ✅ Recommended | Object storage    |
| Local Storage (Development) | ✅ Final       | Local development |

Future providers may include:

* AWS S3
* MinIO
* Azure Blob Storage

---

# AI Layer

## AI Principles

* Business logic must never call AI providers directly.
* AI providers should remain interchangeable.
* Prompt execution must pass through a centralized AI Service.

### AI Flow

```text
Application (NestJS Service)
      ↓
AI Service
      ↓
Provider Layer
      ↓
Gemini / OpenRouter / Groq
```

| Technology    | Status          | Purpose                  |
| ------------- | --------------- | ------------------------ |
| Vercel AI SDK | ✅ Final         | AI provider abstraction  |
| Google Gemini | ✅ Initial Model | Default generation model |
| OpenRouter    | ✅ Final         | Multi-model access       |
| Groq          | ✅ Final         | High-speed inference     |

---

# Video Processing

| Technology | Status  | Purpose                                      |
| ---------- | ------- | -------------------------------------------- |
| FFmpeg     | ✅ Final | Video processing, transcoding & optimization |

---

# State Management

## State Strategy

* React Context should be the default solution for lightweight shared state.
* TanStack Query manages server state (calling the NestJS API).
* Zustand should only be introduced if application complexity requires it.

| Technology     | Status    | Purpose                          |
| -------------- | --------- | -------------------------------- |
| React Context  | ✅ Default | Shared application state         |
| TanStack Query | ✅ Final   | Server state                     |
| Zustand        | ⏳ TBD     | Complex client-side global state |

---

# Validation

Validation schemas should be shared between frontend and backend whenever possible.

| Technology | Status  | Purpose                            |
| ---------- | ------- | ---------------------------------- |
| Zod        | ✅ Final | Schema validation & type inference |

---

# Logging

## Logging Standards

* Structured JSON logs
* Request IDs
* Error stack traces
* Performance metrics
* Environment-aware log levels

| Technology | Status  | Purpose            |
| ---------- | ------- | ------------------ |
| Pino       | ✅ Final | Structured logging |

---

# Testing

## Testing Strategy

* Unit Testing
* Integration Testing
* End-to-End Testing
* API Testing

| Technology | Status  | Purpose                    |
| ---------- | ------- | -------------------------- |
| Jest       | ✅ Final | Unit & integration testing |
| Supertest  | ✅ Final | API testing                |
| Playwright | ✅ Final | End-to-End testing         |

---

# Code Quality

| Technology  | Status  | Purpose               |
| ----------- | ------- | --------------------- |
| ESLint      | ✅ Final | Static analysis       |
| Prettier    | ✅ Final | Code formatting       |
| Husky       | ✅ Final | Git hooks             |
| lint-staged | ✅ Final | Pre-commit validation |

---

# Deployment

## Deployment Strategy

Development

* Local development
* Docker Compose (`web`, `api`, `worker`, `mongodb`, `redis`)

Production

* Frontend (`apps/web`): Vercel (recommended) or self-hosted Next.js
* API (`server`): NestJS service (Docker / cloud host)
* Workers: NestJS worker processes (independently scalable)

Future

* Self-hosted deployment
* AWS
* Kubernetes (if required by scale)

| Technology | Status    | Purpose                    |
| ---------- | --------- | -------------------------- |
| Docker     | ✅ Final   | Containerization           |
| Vercel     | ⏳ Initial | Frontend web deployment    |

---

# Package Management

| Technology | Status  | Purpose            |
| ---------- | ------- | ------------------ |
| pnpm       | ✅ Final | Package management |

---

# Version Control

| Technology | Status  | Purpose            |
| ---------- | ------- | ------------------ |
| Git        | ✅ Final | Version control    |
| GitHub     | ✅ Final | Repository hosting |

---

# Architecture

| Pattern                          | Status  | Purpose                      |
| -------------------------------- | ------- | ---------------------------- |
| Feature-based Architecture       | ✅ Final | Modular project organization |
| Repository Pattern               | ✅ Final | Data access abstraction      |
| Service Layer                    | ✅ Final | Business logic separation    |
| NestJS Dependency Injection      | ✅ Final | Loose coupling               |
| Background Job Architecture      | ✅ Final | Asynchronous processing      |
| Provider Pattern                 | ✅ Final | Swappable external services  |
| Storage Abstraction              | ✅ Final | Provider-independent storage |

---

# Engineering Principles

* TypeScript-first development.
* Feature-based architecture.
* Reusable components over code duplication.
* Business logic should remain framework-independent where practical.
* MongoDB is the single source of truth.
* AI providers must be interchangeable.
* Storage providers must be replaceable.
* Long-running work executes asynchronously in NestJS workers.
* Configuration must be environment-driven.
* Security and observability are first-class concerns.
* Next.js does not host business REST APIs.

---

# High-Level Folder Structure

```text
project-genesis/

├── apps/
│   └── web/                 # Next.js App Router (UI only)
├── server/                  # NestJS API + NestJS workers
├── packages/
│   ├── shared/
│   ├── types/
│   └── sdk/
├── docker/
├── scripts/
├── docs/
└── .github/
```
