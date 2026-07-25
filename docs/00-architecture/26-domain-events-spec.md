# Task

Create **26-domain-events-spec.md**

This document defines the complete Domain Events architecture for Project Genesis.

âš ï¸ This is NOT an implementation document.

âš ï¸ Do NOT generate TypeScript.

âš ï¸ Do NOT generate EventEmitter code.

âš ï¸ Do NOT generate Kafka, RabbitMQ, BullMQ, or Redis implementation.

âš ï¸ Do NOT generate event handlers.

This document defines the domain event architecture, event contracts, publishing strategy, subscribers, reliability, ordering, versioning, and future event-driven architecture.

The architecture has already been finalized.

Never redesign the architecture.

---

# Architecture Status

Architecture Version: 1.1

Status: Frozen

Domain Events represent business facts that already happened.

They are NOT commands.

Business logic remains inside Services.

Events are published AFTER successful business transactions.

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

25-frontend-api-client-spec.md

Treat these documents as the canonical source of truth.

---

# Goal

Produce the canonical Domain Events specification.

This document defines how important business events are published, consumed, versioned, monitored, and evolved while keeping services loosely coupled.

---

# Global Rules

Domain Events MAY:

Notify other parts of the system

Trigger background work

Update search indexes

Generate analytics

Trigger notifications

Trigger webhooks

Update dashboards

Maintain audit logs

Support future microservices

Domain Events MUST NEVER:

Contain business logic

Replace service calls

Modify business entities directly

Replace transactions

Replace validation

Replace authorization

Be used as commands

---

# Event Architecture

Document:

Controller

â†“

Service

â†“

Transaction

â†“

Commit Successful

â†“

Publish Domain Event

â†“

Event Dispatcher

â†“

Subscribers

â†“

Background Processing

Explain responsibilities of every layer.

---

# Event Categories

Define specifications for:

Authentication Events

Workspace Events

Project Events

Story Events

Chapter Events

Scene Events

Character Events

World Events

Asset Events

Prompt Template Events

Generation Events

Export Events

Search Events

Notification Events

Storage Events

System Events

Future Events

---

# Core Domain Events

Create specifications for:

UserRegistered

UserLoggedIn

WorkspaceCreated

WorkspaceUpdated

WorkspaceDeleted

ProjectCreated

ProjectUpdated

ProjectArchived

ProjectDeleted

StoryCreated

StoryUpdated

StoryDeleted

ChapterCreated

ChapterUpdated

SceneCreated

SceneUpdated

SceneDeleted

CharacterCreated

CharacterUpdated

CharacterDeleted

WorldCreated

WorldUpdated

AssetUploaded

AssetDeleted

PromptTemplateCreated

PromptTemplateUpdated

GenerationStarted

GenerationCompleted

GenerationFailed

ExportStarted

ExportCompleted

ExportFailed

NotificationCreated

SearchIndexUpdated

SearchIndexDeleted

BackupCompleted

ArchiveCompleted

WebhookTriggered

Future Events

---

# For EVERY Event Include

## Purpose

Business meaning.

---

## Trigger

Exactly what causes this event.

---

## Publisher

Which service publishes it.

---

## Subscribers

Which services or workers consume it.

---

## Payload

Required fields

Optional fields

Identifiers

Metadata

Correlation IDs

Timestamps

Version

Workspace ID

User ID

Project ID

Security considerations

---

## Delivery Guarantees

At least once

Exactly once (future)

Ordering

Deduplication

Idempotency

---

## Failure Handling

Subscriber failure

Retry

Dead Letter Queue

Poison messages

Monitoring

Replay

---

## Versioning

Event version

Backward compatibility

Deprecation

Migration

Evolution

---

## Security

Sensitive data

PII

Workspace isolation

Audit logging

Encryption

---

## Monitoring

Publish count

Consumer latency

Failure rate

Retry count

Dead letter count

Alerts

Tracing

---

## Testing Requirements

Publisher tests

Subscriber tests

Contract tests

Replay tests

Ordering tests

Version compatibility

Failure recovery

---

# Event Naming Standards

Document:

Past tense naming

Version suffixes

Namespaces

Event IDs

Correlation IDs

Trace IDs

Metadata conventions

---

# Event Ordering

Document:

Ordering guarantees

Cross-service ordering

Same aggregate ordering

Parallel event handling

---

# Event Contracts

Document:

Payload structure

Metadata

Headers

Identifiers

Correlation

Traceability

---

# Event Reliability

Document:

Retries

Outbox Pattern (future)

Dead Letter Queue

Replay strategy

Duplicate detection

Idempotency

---

# Event Consumers

Document:

Notification Worker

Search Worker

Analytics Worker

Webhook Worker

Audit Worker

Future consumers

---

# Event Anti-Patterns

Explicitly prohibit:

Business logic inside events

Commands disguised as events

Mutable event payloads

Direct database updates

Circular event chains

Recursive publishing

Large payloads

Sensitive information leakage

---

# Future Compatibility

Document:

Microservices

Kafka

RabbitMQ

EventBridge

Google Pub/Sub

CQRS

Event Sourcing (future)

Workflow engines

Saga pattern

---

# Final Checklist

Confirm:

âœ“ Every event documented

âœ“ Publishers documented

âœ“ Subscribers documented

âœ“ Payload contracts documented

âœ“ Versioning documented

âœ“ Ordering documented

âœ“ Reliability documented

âœ“ Security documented

âœ“ Testing documented

âœ“ Anti-patterns documented

---

# Output Requirements

Produce a professional engineering specification.

Use markdown.

Use architecture diagrams.

Use event flow diagrams.

Use tables extensively.

Do NOT generate implementation code.

Do NOT generate TypeScript.

Do NOT generate event classes.

Only define event architecture, contracts, workflows, reliability, and standards.

Target approximately 50â€“70 pages when exported to PDF.

This document becomes the canonical implementation reference for the Domain Events architecture.