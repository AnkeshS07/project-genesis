# Task

Create **19-api-controller-spec.md**

This document defines the complete NestJS API Controller specification for Project Genesis.

⚠️ This is NOT an implementation document.

⚠️ Do NOT generate TypeScript.

⚠️ NestJS is the product API framework; do NOT generate NestJS implementation code in this specification.

⚠️ Do NOT generate controllers.

⚠️ Do NOT generate Next.js Route Handlers.

This document defines the contract, responsibilities, request lifecycle, endpoint mapping, validation flow, authentication flow, authorization flow, error handling, and response behavior for every API endpoint.

The architecture has already been finalized.

Never redesign the architecture.

---

# Architecture Status

Architecture Version: 1.1

Status: Frozen

Architecture always wins.

Never introduce new API architecture.

Never move business logic into controllers.

NestJS Controllers are HTTP entry points only.

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

Treat these as the canonical source of truth.

---

# Goal

Produce the canonical API Controller specification.

This document must define every controller and endpoint so another developer can implement the API without making architectural decisions.

---

# Global Controller Rules

The domain REST API is implemented by NestJS Controllers in `server/` at `/api/v1`. `apps/web` is UI-only and must not implement domain APIs through Next.js Route Handlers.

Controllers ONLY:

Receive HTTP requests

Validate request format

Validate DTO/schema

Authenticate users

Authorize access

Call exactly one Service operation

Map Service result into API response

Return HTTP status

Handle exceptions

Log request metadata

Controllers NEVER:

Contain business logic

Access MongoDB

Use Mongoose

Access repositories directly

Call AI providers

Call storage providers

Call queue workers

Contain validation beyond request validation

Coordinate transactions

Perform business decisions

Generate IDs

---

# Controllers

Generate specifications for:

AuthController

WorkspaceController

ProjectController

CharacterController

WorldController

StoryController

ChapterController

SceneController

AssetController

PromptTemplateController

GenerationController

ExportController

DashboardController

SearchController

NotificationController

ActivityLogController

JobController

HealthController

SystemController (if applicable)

---

# For EVERY Controller Include

## Purpose

Explain responsibility.

---

## Base Route

Example:

/api/v1/projects

---

## Authentication

Public

Authenticated

Admin

Workspace Member

Owner

Role requirements

---

## Endpoints

For every endpoint document:

HTTP Method

Route

Purpose

Path Parameters

Query Parameters

Headers

Request Body

Validation

Authentication

Authorization

Service Method Called

Success Response

Error Responses

Status Codes

Pagination

Sorting

Filtering

Search

Rate Limiting

Caching

Idempotency

Audit Logging

---

## Request Lifecycle

Document:

HTTP Request

↓

Middleware

↓

Authentication

↓

Authorization

↓

Validation

↓

NestJS Controller

↓

Service

↓

Repository

↓

Database

↓

Service

↓

NestJS Controller

↓

HTTP Response

---

## Validation Rules

Headers

Body

Params

Query

File uploads

Limits

Formats

Enums

Required fields

Optional fields

---

## Authentication Rules

JWT

Refresh Tokens

Anonymous routes

Expired tokens

Invalid tokens

Workspace validation

---

## Authorization Rules

Owner

Member

Admin

System

Permission matrix

Workspace isolation

---

## Request DTO Mapping

Document:

Incoming payload

DTO mapping

Validation

Transformation

Service input

---

## Response Mapping

Document:

Success envelope

Error envelope

Pagination envelope

Metadata

Consistency rules

---

## File Upload Handling

If applicable:

Multipart handling

Limits

Mime validation

Virus scan trigger

Storage flow

Metadata persistence

Cleanup

---

## AI Request Handling

If applicable:

Generation request

Async response

Job creation

Status polling

Completion

Failure

---

## Error Handling

400

401

403

404

409

422

429

500

503

Document when each is returned.

---

## Rate Limiting

Per endpoint.

Burst limits.

Authenticated users.

Anonymous users.

AI endpoints.

Upload endpoints.

Export endpoints.

---

## Performance Expectations

Expected latency.

Streaming endpoints.

Long-running operations.

Async endpoints.

Pagination requirements.

---

## Logging

Document:

Request logging

Response logging

Sensitive field masking

Correlation IDs

Performance metrics

Audit events

---

## Security

CSRF

CORS

JWT

Input sanitization

Output sanitization

Sensitive fields

Ownership enforcement

Injection prevention

Mass assignment prevention

---

## Testing Requirements

Controller tests

API tests

Validation tests

Authentication tests

Authorization tests

Rate limiting tests

Upload tests

Failure tests

---

# API Conventions

Document:

URL naming

Plural resources

HTTP verbs

Status code conventions

Pagination conventions

Filtering conventions

Sorting conventions

Search conventions

Versioning

Deprecation strategy

Error envelope

Success envelope

---

# Middleware Flow

Document every middleware.

Authentication middleware

Authorization middleware

Validation middleware

Rate limiter

Logging middleware

Error middleware

Request ID middleware

---

# Endpoint Catalog

Create a master table listing:

Method

Route

Controller

Service

Authentication

Authorization

Description

---

# REST Standards

Document:

GET

POST

PUT

PATCH

DELETE

Idempotency

Safe operations

Cacheability

---

# API Anti-Patterns

Explicitly prohibit:

Business logic

Repository usage

Database access

AI calls

Storage calls

Queue logic

Complex validation

Transaction handling

Response inconsistency

Duplicate endpoints

---

# Future Compatibility

Document:

API Versioning

GraphQL compatibility

WebSocket compatibility

Microservice gateway compatibility

Public API strategy

Internal API strategy

API deprecation

---

# Final Checklist

Confirm:

✓ Every controller defined

✓ Every endpoint documented

✓ Every request documented

✓ Every response documented

✓ Every validation documented

✓ Every authentication rule documented

✓ Every authorization rule documented

✓ Every error documented

✓ Every middleware documented

✓ Every testing requirement documented

---

# Output Requirements

Produce a professional engineering specification.

Use markdown.

Use tables extensively.

Use request lifecycle diagrams where appropriate.

Do NOT generate implementation code.

Do NOT generate NestJS implementation code.

Do NOT generate Next.js Route Handlers.

Do NOT generate controllers.

Do NOT generate DTOs.

Only define controller contracts, endpoint specifications, request/response behavior, and API responsibilities.

Target approximately 50–70 pages when exported to PDF.

This document becomes the canonical implementation reference for the API Controller Layer.