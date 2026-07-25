# Coding Standards

## Purpose

This document defines the engineering standards for Project Genesis.

It establishes coding conventions, architecture rules, naming standards, testing requirements, Git workflow, documentation practices, and code review guidelines.

Every contributor must follow these standards to ensure the codebase remains consistent, maintainable, secure, and scalable.

---

# Engineering Principles

Every line of code should be:

* Readable
* Maintainable
* Testable
* Reusable
* Predictable
* Secure
* Performant
* Well Documented

Prefer clarity over cleverness.

---

# General Rules

* Write self-explanatory code.
* Keep functions small and focused.
* Avoid unnecessary abstractions.
* Avoid duplicated logic (DRY).
* Prefer composition over inheritance.
* Prefer explicit code over hidden behavior.
* Keep modules cohesive.
* Remove dead code immediately.
* Do not commit commented-out code.

---

# Language Standards

Primary Language

* TypeScript

Requirements

* `"strict": true`
* Avoid `any`
* Prefer `unknown` over `any`
* Use readonly where appropriate
* Prefer interfaces for object contracts
* Prefer type aliases for unions and utility types

---

# Naming Conventions

## Files

Use **kebab-case**

Examples

```text id="fgh12a"
project.service.ts
user.repository.ts
create-project.dto.ts
```

---

## React Components

Use **PascalCase**

Examples

```text id="bnt48x"
ProjectCard.tsx
CharacterEditor.tsx
StoryTimeline.tsx
```

---

## Variables

Use **camelCase**

Examples

```text id="xz74aa"
projectName
currentUser
storySummary
```

---

## Constants

Use **UPPER_SNAKE_CASE**

Examples

```text id="nkj82q"
MAX_FILE_SIZE
DEFAULT_PAGE_SIZE
JWT_EXPIRATION
```

---

## Interfaces

Prefix with **I** only if the team explicitly adopts that convention. Otherwise use descriptive names.

Preferred

```text id="tr82ms"
Project
Character
GenerationResult
```

Avoid

```text id="hk39aa"
IProject
ICharacter
```

---

## Enums

Use PascalCase.

Example

```text id="op44qa"
ProjectStatus
GenerationType
UserRole
```

---

# Folder Rules

Every folder has one responsibility.

Never mix:

* UI
* Business Logic
* Database
* Provider Code

Business logic belongs only inside the Service Layer.

---

# React Standards

Use:

* Functional Components
* Hooks
* Composition
* Controlled Forms
* Server Components where appropriate
* Client Components only when necessary

Avoid:

* Class Components
* Prop Drilling (prefer Context where justified)
* Large Components
* Anonymous components in exports

---

# Next.js Standards

Use:

* App Router
* Server Actions only when appropriate
* Streaming where beneficial
* Suspense
* Dynamic Imports for heavy modules

`apps/web` is the UI application only. It must not expose domain REST APIs through Next.js Route Handlers; frontend API calls target the NestJS REST API in `server/`.

Do not place business logic inside pages or layouts.

---

# API Standards

The API HTTP layer is implemented in NestJS Controllers in `server/`. Controllers validate and map HTTP requests and responses, then delegate business workflows to Services.

Every endpoint must:

* Validate input
* Authenticate
* Authorize
* Return consistent responses
* Handle errors gracefully

Use proper HTTP methods.

---

# NestJS Standards

Use NestJS modules, dependency injection, Controllers, Services, guards, pipes, interceptors, and exception filters according to their layer boundaries.

* NestJS Controllers are thin HTTP entry points and must not contain business logic or access repositories directly.
* NestJS Services own business rules and orchestration.
* NestJS Workers consume BullMQ jobs and delegate business work to Services.
* Keep HTTP framework details out of Services and Repositories.

---

# Service Layer Standards

Services contain:

* Business Rules
* Transactions
* Orchestration
* Permission Checks

Services must never:

* Access MongoDB directly
* Know HTTP details
* Know UI implementation

---

# Repository Standards

Repositories only:

* Query MongoDB
* Save documents
* Aggregate data
* Handle persistence

Repositories must never contain:

* Business logic
* Authentication
* Authorization
* UI logic

---

# Model Standards

Models should contain:

* Schema
* Indexes
* Default values
* Validation rules supported by the ODM

Models should not contain business workflows.

---

# Error Handling

Use custom application errors.

Every error should include:

* Error Code
* Message
* HTTP Status

Never expose:

* Stack traces
* Internal implementation details
* Secrets

---

# Logging Standards

Log:

* Request ID
* User ID (if available)
* Route
* Duration
* Status Code
* Error Code

Never log:

* Passwords
* Tokens
* Secrets
* API Keys

Use structured logging.

---

# Validation Standards

Use:

* Zod

Validate:

* Request Body
* Query Parameters
* Route Parameters
* File Uploads

Reject unknown fields.

---

# Database Standards

* Use repositories for all database access.
* Keep queries indexed where practical.
* Avoid N+1 query patterns.
* Use transactions for multi-document operations.
* Prefer references over duplication.

---

# AI Integration Standards

All AI requests must:

* Go through the AI Service
* Use provider abstraction
* Log provider and model metadata
* Validate outputs before persistence
* Handle retries gracefully

Never call provider SDKs directly from business services.

---

# Storage Standards

All file operations must go through the Storage Service.

Never:

* Access storage providers directly from UI
* Store binary data in MongoDB

---

# Redis Standards

Use Redis only for:

* Cache
* Rate Limiting
* Queue Coordination
* Temporary Data

Never store permanent business entities.

---

# Async Programming

Prefer:

* async / await

Avoid:

* Deep promise chains
* Unhandled promises

Always handle asynchronous errors.

---

# Function Standards

Functions should:

* Perform one responsibility
* Return predictable values
* Be easy to test

Prefer early returns over deeply nested conditions.

---

# Class Standards

Create classes only when state or dependency management requires them.

Avoid utility classes containing only static methods when standalone functions are sufficient.

---

# Comments

Code should explain **why**, not **what**.

Avoid obvious comments.

Good

```text id="b19aa1"
// Prevent duplicate export requests while a job is already running.
```

Avoid

```text id="m82la8"
// Increment i.
i++;
```

---

# Documentation

Every public module should include:

* Purpose
* Responsibilities
* Dependencies

Complex business logic should include concise explanatory comments.

---

# Performance Standards

* Lazy load heavy modules.
* Avoid unnecessary re-renders.
* Memoize only after measuring.
* Use pagination for large datasets.
* Optimize database queries.
* Cache frequently accessed data.

---

# Security Standards

Always:

* Validate input
* Sanitize output where applicable
* Verify ownership
* Verify permissions
* Protect secrets
* Use HTTPS in production

---

# Testing Standards

Use Jest for unit, integration, and backend API tests; use Supertest for NestJS HTTP integration tests and Playwright for browser end-to-end tests.

Required test types:

* Unit Tests
* Integration Tests
* End-to-End Tests

Critical paths must be covered.

Examples:

* Authentication
* AI Generation
* Project CRUD
* Export Workflow

---

# Git Workflow

Branch naming

```text id="gt83sa"
feature/project-editor
bugfix/upload-error
hotfix/security-patch
refactor/repository-layer
```

Commit message format

```text id="qo18pd"
feat: add character editor

fix: resolve upload validation

refactor: simplify repository logic

docs: update API documentation

test: add generation service tests

chore: update dependencies
```

---

# Pull Request Standards

Every Pull Request should:

* Solve one logical problem
* Pass all tests
* Include documentation updates when applicable
* Avoid unrelated changes
* Be reviewed before merging

---

# Code Review Checklist

Reviewers should verify:

* Architecture compliance
* Naming consistency
* Business logic correctness
* Error handling
* Security
* Test coverage
* Performance considerations
* Documentation updates

---

# Dependency Management

Before adding a dependency:

* Check maintenance status
* Check license compatibility
* Evaluate bundle impact
* Prefer existing utilities when suitable
* Remove unused packages regularly

---

# Environment Variables

Environment variables:

* Must be documented
* Must not be hardcoded
* Must not be committed
* Must have sensible validation at startup

---

# Code Quality Tools

Use:

* ESLint
* Prettier
* TypeScript Strict Mode
* Husky (Git Hooks)
* lint-staged

All linting and tests should pass before merge.

---

# Prohibited Practices

Do not:

* Use `any` without justification
* Duplicate business logic
* Bypass repositories
* Ignore TypeScript errors
* Disable lint rules without reason
* Hardcode secrets
* Commit generated build artifacts
* Leave TODOs without an associated issue or task

---

# Engineering Checklist

Before merging code:

* Architecture followed
* Tests passed
* Lint passed
* Types passed
* Security considered
* Documentation updated
* Performance reviewed
* No dead code
* No debug logs
* No sensitive data exposed

---

# Dependencies

## Depends On

* 02-tech-stack.md
* 09-api-design.md
* 10-architecture.md
* 11-folder-structure.md
* 12-security-design.md

## Used By

* All Frontend Developers
* All Backend Developers
* Code Reviews
* CI/CD Pipelines
* Engineering Onboarding
* Contribution Guidelines
