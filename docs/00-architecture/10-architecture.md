# System Architecture

## Purpose

This document defines the complete architecture of Project Genesis.

It describes how the frontend, backend, database, storage, AI providers, queues, and background workers interact to build a scalable, maintainable, and provider-independent creative platform.

This document is the implementation blueprint for the engineering team.

**Architecture Version:** 1.1  

**Related ADR:** [ADR-001 — NestJS Backend and Next.js Frontend Split](../02-adr/001-nestjs-backend-nextjs-frontend.md)

---

# Architecture Principles

Project Genesis follows these core principles:

* Clean Architecture
* Layered Architecture
* Feature-Based Organization
* Separation of Concerns
* Provider Abstraction
* Storage Abstraction
* Database as the Source of Truth
* AI Provider Independence
* Asynchronous Processing
* Reusable Business Logic
* Modular Design

---

# High-Level Architecture

```text
                        Browser
                           │
                           ▼
              Next.js Application (apps/web)
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        Static Assets   UI Auth UX   HTTP REST Client
                                       │
                                       ▼
                            NestJS REST API (server)
                                       │
                                       ▼
                               Service Layer
                                       │
                 ┌─────────────────────┼─────────────────────┐
                 ▼                     ▼                     ▼
           Repository            AI Provider          Storage Provider
                 │                     │                     │
                 ▼                     ▼                     ▼
              MongoDB           Gemini/OpenRouter      Object Storage
                 │
                 ▼
               Redis ◄──────── BullMQ ◄──────── NestJS Workers
```

---

# Application Layers

```text
Presentation Layer

↓

API Layer

↓

Business Layer

↓

Repository Layer

↓

Infrastructure Layer

↓

External Services
```

---

# Presentation Layer

Responsible for:

* User Interface
* Navigation
* Forms
* Client-side Validation
* State Management
* API Communication

Technology

* Next.js (App Router) in `apps/web`
* React
* TypeScript
* Tailwind CSS
* TanStack Query

Responsibilities

* Never contain business logic
* Never access database directly
* Never call AI providers directly
* Never host business REST APIs (no Next.js Route Handlers for domain APIs)
* Communicate with the NestJS API via the frontend API client / SDK

---

# API Layer

Technology

* NestJS Controllers and modules in `server`

Responsibilities

* Route Requests
* Authentication
* Validation
* Authorization
* Response Formatting

Does Not

* Execute business rules
* Access database directly

---

# Service Layer

The Service Layer contains business logic.

Responsibilities

* Business Rules
* Workflow Orchestration
* Permission Checks
* AI Orchestration
* Job Creation
* Transaction Coordination

The Service Layer never knows how data is stored.

---

# Repository Layer

Responsible for data access.

Responsibilities

* Read Documents
* Create Documents
* Update Documents
* Delete Documents
* Aggregate Queries

Repositories never contain business rules.

---

# Infrastructure Layer

Provides implementations for external systems.

Includes

* MongoDB
* Redis
* Object Storage
* AI Providers
* Queue System
* Logging
* Configuration

---

# Database Architecture

```text
Services

↓

Repositories

↓

MongoDB
```

Database responsibilities

* Persist business data
* Manage relationships
* Transactions
* Indexes

The database is the single source of truth.

---

# Redis Architecture

Redis is used for:

* Caching
* Rate Limiting
* Session Storage
* Queue Coordination
* Temporary Data

Redis never stores permanent business data.

---

# Queue Architecture

Long-running operations are asynchronous.

```text
Client

↓

API

↓

Service

↓

Queue

↓

Worker

↓

Provider

↓

Database
```

Background Jobs

* AI Generation
* Video Rendering
* File Processing
* Export Creation
* Thumbnail Generation

---

# AI Provider Architecture

AI providers are replaceable.

```text
Business Logic

↓

AI Service

↓

Provider Interface

↓

Gemini

OpenRouter

Groq

Future Providers
```

Business logic never depends on a specific provider.

---

# Storage Architecture

Files are stored outside MongoDB.

```text
Client

↓

Upload API

↓

Storage Service

↓

Object Storage

↓

Asset Metadata

↓

MongoDB
```

Supported Providers

* Cloudflare R2
* Amazon S3
* MinIO
* Azure Blob Storage

Storage providers implement a common interface.

---

# Authentication Architecture

```text
Login (via NestJS API)

↓

JWT Issued

↓

Client Stores Token

↓

Protected Request (from Next.js UI)

↓

NestJS Middleware / Guards

↓

Authentication

↓

Authorization

↓

NestJS Controller
```

Authentication

* JWT Access Token
* Refresh Token

Authorization

* Resource Ownership
* User Roles

---

# Authorization Flow

Every protected request passes through:

```text
Authentication

↓

Resource Ownership

↓

Permission Validation

↓

Business Logic
```

---

# Request Lifecycle

```text
Browser

↓

Next.js (apps/web)

↓

HTTP REST Client / SDK

↓

NestJS Middleware / Guards

↓

Authentication

↓

Validation

↓

NestJS Controller

↓

Service

↓

Repository

↓

MongoDB

↓

Response
```

---

# AI Generation Lifecycle

```text
Client

↓

Create Generation

↓

Generation Service

↓

Queue

↓

Worker

↓

AI Provider

↓

Store Result

↓

Notify User
```

---

# Export Lifecycle

```text
Project

↓

Collect Assets

↓

Generate Export

↓

Queue

↓

Worker

↓

Storage

↓

Download URL
```

---

# Error Handling

Errors are handled at three levels.

Presentation

* Friendly Messages

Business

* Validation
* Rules
* Permissions

Infrastructure

* Database
* Queue
* AI Provider
* Storage

---

# Logging Architecture

Every request should produce structured logs.

Log Categories

* API
* Authentication
* AI
* Storage
* Queue
* Errors
* Performance

Sensitive information must never be logged.

---

# Configuration Architecture

Configuration must be environment-driven.

Sources

* Environment Variables
* Secret Manager
* Runtime Configuration

Application code must never contain secrets.

---

# Dependency Rules

Presentation Layer

↓

API Layer

↓

Service Layer

↓

Repository Layer

↓

Infrastructure

Higher layers never depend on lower implementations.

Dependencies point inward.

---

# Folder Ownership

```text
apps/web/
        Next.js UI (presentation only)

server/
        NestJS API, services, repositories, workers

packages/
        Shared types, SDK, shared utilities

providers/ (under server)
        External service adapters

storage/ (under server or packages as configured)
        Storage provider adapters

queue/ / workers (under server)
        BullMQ + NestJS Workers

docs/
        Architecture, epics, ADRs, assets
```

---

# Cross-Cutting Concerns

Applied across all modules:

* Authentication
* Authorization
* Logging
* Validation
* Error Handling
* Rate Limiting
* Metrics
* Monitoring

---

# Scalability Strategy

The architecture supports:

* Horizontal Scaling
* Multiple AI Providers
* Multiple Storage Providers
* Distributed Workers
* Large File Processing
* Future Team Collaboration

---

# Security Architecture

Security layers include:

* HTTPS
* JWT Authentication
* Input Validation
* Output Sanitization
* Rate Limiting
* Ownership Verification
* Secure File Upload
* Audit Logging

---

# Architectural Decisions

* Database owns business data.
* AI providers are replaceable.
* Storage providers are replaceable.
* Long-running tasks execute asynchronously.
* Business logic remains independent of frameworks.
* Files are never stored inside MongoDB.
* Business entities are referenced rather than duplicated.
* Every request follows the same processing pipeline.
* Every external integration is abstracted behind an interface.

---

# Future Architecture

The architecture supports future additions without major redesign.

Possible future modules:

* Team Collaboration
* Shared Workspaces
* Plugin System
* AI Agents
* Voice Studio
* Music Studio
* 3D Character Studio
* Marketplace
* Desktop Application
* Mobile Application
* Webhooks
* Public API
* GraphQL Gateway

---

# Architecture Summary

```text
                           Browser
                               │
                               ▼
                    Next.js Frontend (apps/web)
                               │
                               ▼
                      NestJS REST API (server)
                               │
                               ▼
                         Service Layer
               ┌───────────────┼───────────────┐
               ▼               ▼               ▼
         Repository      AI Service     Storage Service
               │               │               │
               ▼               ▼               ▼
           MongoDB      AI Providers     Object Storage
               │
               ▼
             Redis
               │
               ▼
     BullMQ & NestJS Background Workers
```

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

## Used By

* Frontend Implementation
* Backend Implementation
* Repository Layer
* Service Layer
* Queue Workers
* Storage Providers
* AI Providers
* Deployment
* DevOps
* Testing
* Monitoring
