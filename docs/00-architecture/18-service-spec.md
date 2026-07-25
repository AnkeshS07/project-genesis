# Task

Create **18-service-spec.md**

This document defines the complete Service Layer specification for Project Genesis.

⚠️ This is NOT an implementation document.

⚠️ Do NOT generate TypeScript.

⚠️ Do NOT generate service classes.

⚠️ Do NOT write business logic implementation.

This document defines the contract, responsibilities, orchestration rules, and business workflows for every service.

The architecture has already been finalized.

Never redesign the architecture.

---

# Architecture Status

Architecture Version: 1.1

Status: Frozen

The architecture is the single source of truth.

If implementation conflicts with architecture, architecture always wins.

Never introduce new architectural patterns.

Never move business logic outside the Service layer.

---

# Source Documents

Use ONLY the finalized documents:

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

Treat them as the canonical source of truth.

---

# Goal

Produce the canonical Service Layer Specification.

This document must define every business service in sufficient detail that another developer can implement it without making architectural decisions.

---

# Global Service Rules

The Service Layer is the ONLY place where business logic exists.

Services MAY:

- Validate business rules
- Coordinate repositories
- Coordinate transactions
- Call AI Providers
- Call Storage Providers
- Call Queue Workers
- Publish domain events (future)
- Create activity logs
- Create notifications
- Coordinate multiple repositories

Services MUST NOT:

- Access MongoDB directly
- Use Mongoose directly
- Write HTTP responses
- Read NestJS request or response objects
- Return HTTP responses
- Contain UI logic
- Contain React logic
- Know about NestJS Controllers or any HTTP-layer implementation
- Know about React Components

Services communicate only through repositories and provider interfaces.

---

# Services

Create specifications for:

AuthService

WorkspaceService

ProjectService

CharacterService

WorldService

StoryService

ChapterService

SceneService

AssetService

PromptTemplateService

GenerationService

ExportService

NotificationService

ActivityLogService

SearchService

DashboardService

JobService

AIService

StorageService

---

# For EVERY Service Include

## Purpose

Explain the responsibility of this service.

---

## Dependencies

Repositories used

Other services used

AI providers

Storage providers

Queue workers

Allowed dependencies

Forbidden dependencies

---

## Business Responsibilities

Exactly what this service owns.

Exactly what this service never owns.

---

## Public Operations

List every operation.

For every operation specify:

Purpose

Inputs

Outputs

Business rules

Validation

Authorization assumptions

Repository usage

Transaction participation

External providers involved

Failure scenarios

Success outcome

---

## Business Workflow

Describe the complete workflow.

Example:

Validate Request

↓

Validate Ownership

↓

Load Required Entities

↓

Execute Business Rules

↓

Start Transaction (if required)

↓

Repository Operations

↓

Commit Transaction

↓

Queue Background Work

↓

Audit Logging

↓

Return Result

---

## Validation Rules

Ownership validation

Workspace validation

Project validation

Entity existence

Business constraints

Immutable rules

Duplicate prevention

Reference validation

---

## Transaction Rules

When transactions are required

Repositories involved

Rollback conditions

Consistency guarantees

---

## AI Integration

If applicable:

Prompt preparation

Provider selection

Retry strategy

Failure handling

Generation tracking

Token accounting

Result persistence

---

## Storage Integration

If applicable:

Upload flow

Download flow

Deletion

Metadata updates

Validation

Cleanup

---

## Queue Integration

If applicable:

Jobs created

Job lifecycle

Retry policy

Failure handling

Idempotency

---

## Activity Logging

Document:

What events are logged

When

Why

Information captured

---

## Notification Rules

Document:

Who is notified

When

Notification type

Delivery timing

---

## Security

Authorization assumptions

Ownership validation

Sensitive data

Data exposure rules

Audit requirements

---

## Error Handling

Validation errors

Business rule violations

Missing entities

Provider failures

Storage failures

Database failures

Transaction failures

Concurrency conflicts

---

## Performance Expectations

Expected response time

Async operations

Batch operations

Caching opportunities

Scalability considerations

---

## Testing Requirements

Unit tests

Business rule tests

Transaction tests

Integration tests

Failure tests

Concurrency tests

Performance tests

---

## Service Contract

Document:

Input contract

Output contract

Business guarantees

Consistency guarantees

Side effects

Failure guarantees

---

# Cross Service Rules

Document:

Service-to-service communication

Dependency direction

Circular dependency prevention

Shared business rules

Transaction coordination

Ownership boundaries

---

# Domain Workflows

Document complete workflows for:

User Registration

Workspace Creation

Project Creation

Character Creation

World Creation

Story Creation

Scene Management

Asset Upload

AI Content Generation

AI Image Generation

Export Generation

Search

Dashboard Loading

Notification Flow

Activity Logging

Background Job Processing

---

# Service Naming Standards

Document:

Method naming

Transaction naming

Validation naming

Workflow naming

Internal helper naming

---

# Business Rule Standards

Document:

Ownership rules

Immutable entities

Deletion rules

Restore rules

Versioning

Conflict resolution

Duplicate prevention

Reference integrity

Consistency guarantees

---

# Service Anti-Patterns

Explicitly prohibit:

Database access

Mongoose usage

HTTP handling

NestJS HTTP request or response objects

UI logic

React hooks

Business logic inside repositories

Business logic inside controllers

Business logic inside providers

Business logic inside queue workers

Duplicated business rules

---

# Future Compatibility

Document:

Future AI providers

Future storage providers

Future event bus

Future microservices

Future multi-tenant support

Future distributed transactions

Future workflow engine

---

# Final Checklist

Confirm:

✓ Every service defined

✓ Every business workflow documented

✓ Every operation documented

✓ Every validation documented

✓ Every transaction documented

✓ Every provider interaction documented

✓ Every activity log documented

✓ Every notification documented

✓ Every testing requirement documented

✓ Every anti-pattern documented

---

# Output Requirements

Produce a professional engineering specification.

Use markdown.

Use tables wherever appropriate.

Use workflow diagrams where useful.

Do NOT generate code.

Do NOT generate TypeScript.

Do NOT generate classes.

Do NOT generate interfaces.

Do NOT generate DTOs.

Only define service contracts, responsibilities, business workflows, and orchestration.

Target approximately 60–80 pages when exported to PDF.

This document becomes the canonical implementation reference for the entire Service Layer.