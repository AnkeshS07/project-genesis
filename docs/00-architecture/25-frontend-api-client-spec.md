# Task

Create **25-frontend-api-client-spec.md**

This document defines the complete Frontend API Client architecture for Project Genesis.

âš ï¸ This is NOT an implementation document.

âš ï¸ Do NOT generate React code.

âš ï¸ Do NOT generate TypeScript.

âš ï¸ Do NOT generate hooks.

âš ï¸ Do NOT generate API client code.

This document defines the frontend networking architecture, API client contracts, caching strategy, authentication flow, error handling, retry behavior, and data synchronization.

The architecture has already been finalized.

Never redesign the architecture.

---

# Architecture Status

Architecture Version: 1.1

Status: Frozen

Frontend Components MUST NEVER communicate directly with the backend.

All communication must go through the API Client layer.

Business logic belongs in backend Services.

Frontend manages presentation and client state only.

---

# Source Documents

Use ONLY:

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

Treat these documents as the canonical source of truth.

---

# Goal

Produce the canonical Frontend API Client specification.

This document defines how the frontend communicates with backend APIs in a scalable, maintainable, and provider-independent manner.

---

# Global Rules

The API Client MAY:

Call backend APIs

Manage authentication tokens

Refresh expired tokens

Cache responses

Retry requests

Upload files

Download files

Normalize API responses

Handle pagination

Support optimistic updates

Support request cancellation

Support polling

Support streaming

The API Client MUST NEVER:

Contain business logic

Access databases

Call AI providers directly

Call storage providers directly

Perform authorization

Modify backend rules

Access environment secrets

---

# Frontend Architecture

Document:

React Component

â†“

Custom Hook

â†“

API Client

â†“

HTTP Client

â†“

Backend API

â†“

Response Normalization

â†“

Cache

â†“

Component Update

Explain responsibilities.

---

# API Modules

Create specifications for:

Auth API

Workspace API

Project API

Character API

World API

Story API

Chapter API

Scene API

Asset API

Prompt Template API

Generation API

Export API

Search API

Notification API

Dashboard API

User API

Health API

---

# Authentication

Document:

Login

Logout

Access Token

Refresh Token

Automatic Refresh

Expired Token Handling

Unauthorized Flow

Session Restoration

Multi-tab Synchronization

---

# HTTP Client

Document:

Base URL

Headers

Authentication

Timeout

Retries

Request IDs

Correlation IDs

Compression

Streaming

Abort Controller

---

# Request Lifecycle

Document:

React Component

â†“

Hook

â†“

API Client

â†“

HTTP Client

â†“

Middleware

â†“

Backend

â†“

Response

â†“

Normalization

â†“

Cache

â†“

UI Update

---

# Response Handling

Document:

Success responses

Error responses

Pagination

Metadata

Validation errors

Business errors

Network errors

Timeouts

Retry behavior

---

# Caching Strategy

Document:

TanStack Query integration

Cache keys

Invalidation

Stale time

Cache time

Background refresh

Prefetching

Optimistic updates

---

# Pagination

Document:

Cursor pagination

Offset pagination

Infinite scrolling

Load more

Sorting

Filtering

---

# File Upload

Document:

Upload workflow

Multipart uploads

Progress tracking

Cancellation

Retry

Validation

Large files

---

# File Download

Document:

Streaming

Blob handling

Progress

Cancellation

Error handling

Signed URLs

---

# AI Generation

Document:

Generation request

Polling

Status updates

Completion

Cancellation

Retry

Progress

---

# Error Handling

Document:

400

401

403

404

409

422

429

500

503

Offline mode

Network failures

Retry strategy

---

# Performance

Document:

Lazy loading

Code splitting

Prefetching

Caching

Batch requests

Deduplication

Parallel requests

Suspense compatibility

---

# Security

Document:

Token storage

CSRF

XSS prevention

Sensitive data

Cookie strategy

Secure headers

Logout handling

---

# State Management

Document:

Server State

Client State

UI State

Form State

Authentication State

Upload State

Generation State

---

# Offline Support

Document:

Offline detection

Retry queue

Cached responses

Sync strategy

Conflict handling

---

# Testing Requirements

API Client tests

Hook tests

Authentication tests

Cache tests

Retry tests

Upload tests

Download tests

Offline tests

Performance tests

---

# Frontend API Anti-Patterns

Explicitly prohibit:

Direct fetch() calls inside components

Business logic in hooks

Business logic in components

Hardcoded URLs

Hardcoded tokens

Duplicate API calls

Ignoring cache

Ignoring retries

Ignoring request cancellation

---

# Future Compatibility

Document:

SSR

RSC compatibility

Streaming

GraphQL compatibility

WebSockets

SSE

Mobile clients

Desktop clients

SDK generation

OpenAPI generation

---

# Final Checklist

Confirm:

âœ“ Every API module documented

âœ“ Authentication documented

âœ“ Request lifecycle documented

âœ“ Cache strategy documented

âœ“ Error handling documented

âœ“ Upload/download documented

âœ“ AI generation flow documented

âœ“ Security documented

âœ“ Testing documented

âœ“ Anti-patterns documented

---

# Output Requirements

Produce a professional engineering specification.

Use markdown.

Use architecture diagrams where appropriate.

Use tables extensively.

Do NOT generate implementation code.

Do NOT generate React components.

Do NOT generate hooks.

Do NOT generate TypeScript.

Only define API client architecture, networking contracts, caching, workflows, and standards.

Target approximately 50â€“70 pages when exported to PDF.

This document becomes the canonical implementation reference for the Frontend API Layer.