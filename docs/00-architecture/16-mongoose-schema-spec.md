# Task

Create **16-mongoose-schema-spec.md**

This document defines the complete implementation specification for all MongoDB collections and Mongoose schemas used in Project Genesis.

⚠️ This is NOT a database design document.

The architecture and database design have already been finalized.

Your job is to translate the approved architecture into implementation specifications that developers can implement directly.

Do NOT redesign anything.

---

# Architecture Status

The architecture is frozen.

Follow it exactly.

If implementation conflicts with architecture, architecture always wins.

Never introduce new architectural decisions.

---

# Source Documents

Use ONLY these documents as input:

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

Treat them as the single source of truth.

---

# Goal

Produce the canonical Mongoose Schema Specification.

This document must contain everything required for another developer to implement every Mongoose schema without making any architectural decisions.

This is an implementation document.

Not a design document.

---

# Global Rules

Never redesign the architecture.

Never invent new entities.

Never merge entities.

Never duplicate business data.

Always use reference-based relationships.

Workspace owns shared entities.

Projects reference shared entities.

Generation records remain immutable.

Files are stored outside MongoDB.

MongoDB stores metadata only.

Repositories are the only layer allowed to access Mongoose.

Business logic never belongs inside models.

---

# Collections

Generate complete specifications for:

- users
- workspaces
- projects
- characters
- worlds
- stories
- chapters
- scenes
- assets
- prompt_templates
- generations
- jobs
- exports
- activity_logs
- notifications

---

# For EVERY Collection Include

## Purpose

Explain why this collection exists.

---

## Ownership

Who owns this entity.

Parent entity.

Child entities.

Ownership rules.

---

## Lifecycle

Creation

Updates

Soft Delete

Restore

Permanent Delete

Versioning

Immutability

Retention

---

## Required Fields

Create a table containing:

- Field Name
- Data Type
- Required
- Default
- Validation
- Nullable
- Unique
- Indexed
- Immutable
- Reference
- Description

---

## Optional Fields

Same table format.

---

## Relationships

Document:

One-to-One

One-to-Many

Many-to-One

Many-to-Many

Reference direction.

Parent references.

Child references.

---

## Index Strategy

Document:

Primary indexes

Secondary indexes

Compound indexes

Unique indexes

Text indexes

TTL indexes (if applicable)

Explain WHY every index exists.

---

## Validation Rules

Field validation

Enum validation

Length validation

Regex validation

Reference validation

Ownership validation

Business validation

---

## Soft Delete Rules

Explain:

isDeleted

deletedAt

Visibility

Restoration

Retention

Permanent cleanup

---

## Versioning

Explain:

version field

Optimistic locking

Concurrency behavior

Historical versions

Future compatibility

---

## Transaction Participation

List every transaction involving this entity.

Explain why transactions are required.

---

## Repository Responsibilities

Repositories MAY:

...

Repositories MUST NOT:

...

---

## Service Responsibilities

Services validate

Services orchestrate

Services coordinate transactions

Services enforce business rules

---

## API Usage

List every REST endpoint using this collection.

---

## Worker Usage

List every background worker using this collection.

---

## Security

Ownership validation

Authorization

Audit logging

Sensitive fields

Never expose fields

---

## Testing Requirements

Unit tests

Repository tests

Integration tests

API tests

Security tests

Performance tests

---

## Mongoose Implementation Guidelines

Specify:

Collection name

timestamps

strict mode

versionKey

minimize

toJSON

toObject

virtuals

indexes

middleware

pre hooks

post hooks

instance methods (if required)

static methods (if required)

⚠️ Do NOT write code.

Describe implementation only.

---

# Cross Collection Rules

Document:

Reference strategy

Ownership model

Cascade behavior

Deletion behavior

Transaction boundaries

Concurrency strategy

ObjectId usage

Naming conventions

Audit conventions

Collection naming

Reference naming

Timestamp conventions

---

# Global Mongoose Standards

Document:

Schema conventions

Model conventions

Plugin strategy

Serialization rules

Virtuals strategy

Population strategy

Lean query recommendations

Performance recommendations

Scalability recommendations

Migration considerations

Future compatibility

Known limitations

---

# Final Implementation Checklist

Create a checklist confirming:

✓ Every collection defined

✓ Every relationship documented

✓ Every index documented

✓ Every validation documented

✓ Every transaction documented

✓ Every ownership rule documented

✓ Every security rule documented

✓ Every testing requirement documented

✓ Every Mongoose convention documented

---

# Output Requirements

Produce a professional engineering specification.

Use markdown.

Use tables wherever appropriate.

Do NOT generate code.

Do NOT generate TypeScript.

Do NOT generate Mongoose schemas.

Do NOT generate interfaces.

Do NOT generate DTOs.

Only generate implementation specifications.

Target approximately 40–70 pages when exported to PDF.

This document becomes the canonical implementation reference for all future Mongoose schema development.