# Task

Create **23-queue-worker-spec.md**

This document defines the complete Queue & Worker architecture for Project Genesis.

⚠️ This is NOT an implementation document.

⚠️ Do NOT generate TypeScript.

⚠️ Do NOT generate BullMQ code.

⚠️ Do NOT generate queue implementation.

⚠️ Do NOT generate worker classes.

This document defines the contracts, responsibilities, lifecycle, reliability, scaling strategy, monitoring, and architecture for all background processing.

The architecture has already been finalized.

Never redesign the architecture.

---

# Architecture Status

Architecture Version: 1.1

Status: Frozen

NestJS Workers are infrastructure.

Business logic belongs ONLY in the Service Layer.

Workers execute background orchestration only.

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

Treat these as the canonical source of truth.

---

# Goal

Produce the canonical Queue & Worker specification.

The document must define how all asynchronous work is executed, monitored, retried, and scaled while keeping business logic inside the Service Layer.

---

# Global Rules

Workers are NestJS Workers in `server/`, using BullMQ queues backed by Redis. They are deployed separately from the NestJS REST API while sharing the same Service-layer boundaries.

Workers MAY:

Execute background jobs

Call Services

Call AI Providers through Services

Call Storage Providers through Services

Update job progress

Retry failed jobs

Generate logs

Emit metrics

Update job status

Workers MUST NEVER:

Contain business logic

Access controllers

Access HTTP requests

Access React

Use repositories directly

Make authorization decisions

Make authentication decisions

Return HTTP responses

---

# Queue Architecture

Document:

Client

↓

NestJS Controller

↓

Service

↓

Queue

↓

NestJS Worker

↓

Service

↓

Repository

↓

Database

Explain every layer.

---

# Queue Technology

Use:

BullMQ

Redis

NestJS Workers

Design for future RabbitMQ compatibility

Future Kafka compatibility

Future SQS compatibility

Future Google Pub/Sub compatibility

---

# Queues

Define specifications for:

AI Generation Queue

Image Generation Queue

Export Queue

Thumbnail Queue

Search Index Queue

Notification Queue

Email Queue

Cleanup Queue

Archive Queue

Backup Queue

Analytics Queue

Webhook Queue

Future queues

---

# Worker Specifications

Create specifications for:

Generation Worker

Image Worker

Export Worker

Thumbnail Worker

Search Worker

Notification Worker

Cleanup Worker

Archive Worker

Analytics Worker

Backup Worker

Webhook Worker

---

# For EVERY Queue Include

## Purpose

Explain responsibility.

---

## Trigger

What creates this job.

---

## Payload

Required fields.

Optional fields.

Validation.

Size expectations.

Sensitive fields.

---

## Priority

Low

Normal

High

Critical

Explain priority rules.

---

## Delay

Immediate

Scheduled

Deferred

Retry delay

---

## Retry Strategy

Maximum retries

Backoff strategy

Retry conditions

Permanent failure conditions

---

## Timeout

Expected execution time.

Maximum execution time.

Cancellation rules.

---

## Progress Tracking

Queued

Waiting

Running

Retrying

Completed

Failed

Cancelled

Expired

---

## Idempotency

Document:

Duplicate detection

Idempotency keys

Safe retries

Repeated execution rules

---

## Failure Handling

Provider failure

Database failure

Storage failure

Timeout

Network failure

Partial completion

Rollback strategy

Dead Letter Queue

---

## Concurrency

Maximum concurrent jobs

Worker scaling

Parallel execution

Sequential execution

Resource limits

---

## Job Lifecycle

Document:

Job Created

↓

Validated

↓

Queued

↓

Claimed

↓

Executing

↓

Progress Updates

↓

Completed

↓

Cleanup

↓

Archived

---

## Monitoring

Queue depth

Worker utilization

Average execution time

Failure rate

Retry count

Latency

Health checks

Alerts

---

## Security

Payload validation

Sensitive data

Encryption

Workspace isolation

Audit logging

Access control

---

## Performance

Batch processing

Bulk jobs

Memory limits

CPU limits

Large job handling

Rate limiting

Backpressure

---

## Testing Requirements

Worker tests

Retry tests

Failure tests

Concurrency tests

Performance tests

Recovery tests

Idempotency tests

---

# Queue Management

Document:

Queue creation

Queue naming

Queue configuration

Queue cleanup

Retention

History

Metrics

Pause/Resume

Maintenance mode

---

# Dead Letter Queue

Document:

Purpose

Failure thresholds

Replay

Investigation

Retention

Cleanup

Monitoring

---

# Scheduling

Document:

Delayed jobs

Recurring jobs

Cron jobs

Maintenance jobs

Cleanup jobs

Archive jobs

---

# Scaling Strategy

Document:

Horizontal scaling

Vertical scaling

Worker auto-scaling

Redis scaling

Queue partitioning

Future distributed workers

---

# Observability

Document:

Structured logging

Metrics

Tracing

Correlation IDs

Job IDs

Alerts

Dashboards

Error reporting

---

# Worker Anti-Patterns

Explicitly prohibit:

Business logic

Repository access

Controller access

HTTP handling

Long-lived database transactions

Infinite retries

Blocking operations

Hardcoded queues

Hardcoded retry counts

Ignoring idempotency

---

# Future Compatibility

Document:

Distributed queues

Cross-region workers

Multi-cloud queues

Event-driven architecture

Workflow engines

Saga pattern

Microservices

AI orchestration

---

# Final Checklist

Confirm:

✓ Every queue documented

✓ Every worker documented

✓ Job lifecycle documented

✓ Retry strategy documented

✓ Dead Letter Queue documented

✓ Scheduling documented

✓ Monitoring documented

✓ Security documented

✓ Performance documented

✓ Testing documented

✓ Anti-patterns documented

---

# Output Requirements

Produce a professional engineering specification.

Use markdown.

Use architecture diagrams where appropriate.

Use tables extensively.

Do NOT generate implementation code.

Do NOT generate BullMQ code.

Do NOT generate TypeScript.

Do NOT generate workers.

Only define queue architecture, worker contracts, lifecycle, scaling, monitoring, and operational standards.

Target approximately 50–70 pages when exported to PDF.

This document becomes the canonical implementation reference for the Queue & Worker Layer.