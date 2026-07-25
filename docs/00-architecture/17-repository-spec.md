# Task

Create **17-repository-spec.md**

This document defines the complete Repository Layer specification for Project Genesis.

⚠️ This is NOT an implementation document.

⚠️ Do NOT write TypeScript.

⚠️ Do NOT generate repository code.

This document defines the contract every repository implementation must follow.

The architecture has already been finalized.

Your responsibility is to convert the architecture into Repository specifications.

Never redesign the architecture.

---

# Architecture Status

Architecture Version: 1.1

Status: Frozen

Architecture always wins.

If implementation conflicts with architecture, architecture wins.

Never introduce new architectural decisions.

---

# Source Documents

Use ONLY the finalized architecture documents:

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

Treat these documents as the single source of truth.

---

# Goal

Produce the canonical Repository Layer Specification.

This document must contain everything required for another developer to implement every repository without making architecture decisions.

---

# Global Repository Rules

Repositories are responsible ONLY for persistence.

Repositories NEVER contain business logic.

Repositories NEVER perform authorization.

Repositories NEVER perform authentication.

Repositories NEVER call AI Providers.

Repositories NEVER call Storage Providers.

Repositories NEVER call external APIs.

Repositories NEVER perform orchestration.

Repositories NEVER validate business rules.

Repositories NEVER know HTTP.

Repositories NEVER know React.

Repositories NEVER know UI.

Repositories NEVER know NestJS Controllers or any other HTTP-layer implementation.

Repositories ONLY interact with MongoDB through Mongoose.

Repositories ONLY return domain data.

Repositories NEVER return HTTP responses.

Repositories NEVER log business events.

Repositories NEVER start background jobs.

Repositories NEVER send notifications.

Repositories NEVER modify unrelated collections unless explicitly part of a transaction.

---

# Repository List

Create specifications for:

UserRepository

WorkspaceRepository

ProjectRepository

CharacterRepository

WorldRepository

StoryRepository

ChapterRepository

SceneRepository

AssetRepository

PromptTemplateRepository

GenerationRepository

JobRepository

ExportRepository

ActivityLogRepository

NotificationRepository

---

# For EVERY Repository Include

## Purpose

Explain the repository responsibility.

---

## Collection

Specify the MongoDB collection.

---

## Dependencies

Allowed dependencies.

Forbidden dependencies.

---

## Repository Responsibilities

Exactly what this repository owns.

Exactly what it never owns.

---

## Read Operations

List every read operation.

For each operation include:

Purpose

Inputs

Outputs

Filters

Sorting

Pagination

Population

Indexes used

Ownership filtering

Performance considerations

---

## Write Operations

List every write operation.

For each operation include:

Purpose

Inputs

Outputs

Validation assumptions

Transaction participation

Audit requirements

---

## Update Operations

Document:

Partial updates

Full updates

Optimistic locking

Version handling

Timestamp updates

---

## Delete Operations

Document:

Soft delete

Restore

Permanent delete

Retention

Cascade behavior

---

## Query Specifications

Document:

Search queries

Filter queries

Pagination

Sorting

Aggregation

Lookup usage

Text search

Reference loading

Lean queries

Cursor vs Offset pagination

---

## Transaction Participation

List every transaction involving this repository.

Explain why.

---

## Index Usage

For every operation specify:

Expected indexes

Compound indexes

Unique indexes

Performance expectations

---

## Error Conditions

Document:

Not found

Duplicate

Conflict

Version mismatch

Invalid reference

Database unavailable

Transaction failure

Timeout

---

## Performance Expectations

Expected query complexity.

Expected response time.

Caching opportunities.

Large collection considerations.

---

## Security

Ownership filtering.

Workspace isolation.

Data visibility.

Sensitive fields.

Audit logging expectations.

---

## Testing Requirements

Repository unit tests.

Integration tests.

Transaction tests.

Concurrency tests.

Performance tests.

Failure scenarios.

---

## Repository Contract

Document:

Input contract.

Output contract.

Error contract.

Transaction contract.

Consistency guarantees.

---

# Cross Repository Rules

Document:

Repository interaction rules.

Repository independence.

Shared transaction coordination.

Cross-repository transactions.

Reference integrity.

Consistency guarantees.

---

# Repository Naming Standards

Document:

Method naming conventions.

Query naming conventions.

Pagination naming.

Filter naming.

Search naming.

Transaction naming.

---

# Repository Performance Guidelines

Document:

Lean queries.

Projection.

Population strategy.

Avoiding N+1 queries.

Aggregation guidelines.

Bulk operations.

Streaming.

Large dataset handling.

---

# Repository Anti-Patterns

Explicitly prohibit:

Business logic.

HTTP logic.

Authentication.

Authorization.

AI calls.

Storage calls.

Notification sending.

Event publishing.

Validation beyond persistence.

Cross-layer dependencies.

Direct controller usage.

---

# Future Compatibility

Document:

Repository extensibility.

Future collections.

Future indexes.

Future partitioning.

Future sharding considerations.

Future multi-tenant considerations.

---

# Final Checklist

Confirm:

✓ Every repository defined

✓ Every CRUD operation documented

✓ Every transaction documented

✓ Every query documented

✓ Every index documented

✓ Every dependency documented

✓ Every security rule documented

✓ Every testing requirement documented

✓ Every anti-pattern documented

---

# Output Requirements

Produce a professional engineering specification.

Use markdown.

Use tables extensively.

Do NOT write implementation code.

Do NOT generate TypeScript.

Do NOT generate interfaces.

Do NOT generate repository classes.

Do NOT generate Mongoose code.

Only define repository contracts and responsibilities.

Target approximately 40–60 pages when exported to PDF.

This document becomes the canonical implementation reference for the Repository Layer.