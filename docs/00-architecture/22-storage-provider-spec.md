# Task

Create **22-storage-provider-spec.md**

This document defines the complete Storage Provider Layer specification for Project Genesis.

âš ï¸ This is NOT an implementation document.

âš ï¸ Do NOT generate TypeScript.

âš ï¸ Do NOT generate SDK code.

âš ï¸ Do NOT generate provider classes.

âš ï¸ Do NOT generate upload/download code.

This document defines the storage abstraction layer, provider contracts, file lifecycle, security model, metadata handling, reliability, and scalability.

The architecture has already been finalized.

Never redesign the architecture.

---

# Architecture Status

Architecture Version: 1.1

Status: Frozen

Storage Providers are infrastructure components.

Business logic MUST remain inside the Service Layer.

Storage Providers MUST remain provider-independent.

The application must be able to switch storage providers without changing business logic.

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

Treat these documents as the canonical source of truth.

---

# Goal

Produce the canonical Storage Provider specification.

This document defines how files are stored, retrieved, secured, versioned, and managed while keeping the application independent of any storage vendor.

---

# Global Storage Rules

Storage Providers ONLY:

Upload files

Download files

Delete files

Move files

Copy files

Generate signed URLs

Validate storage operations

Return metadata

Handle provider-specific APIs

Manage object lifecycle

Storage Providers NEVER:

Contain business logic

Access MongoDB directly

Access repositories

Perform authentication

Perform authorization

Access HTTP requests

Call AI providers

Call queue workers

Create notifications

Make business decisions

---

# Supported Providers

Design for:

Amazon S3

Cloudflare R2

MinIO

Azure Blob Storage

Google Cloud Storage

Future providers

---

# Storage Architecture

Document:

Service

â†“

StorageService

â†“

Storage Provider Interface

â†“

Provider Factory

â†“

Concrete Provider

â†“

Object Storage

Explain responsibilities of each layer.

---

# Provider Interface

Define the common contract for all storage providers.

Document:

Upload

Download

Delete

Move

Copy

Exists

Generate Signed URL

List Objects

Get Metadata

Update Metadata

Batch Operations

Health Check

Future compatibility

---

# Provider Factory

Document:

Provider selection

Configuration loading

Environment selection

Default provider

Fallback provider

Health-aware routing

Future provider registration

---

# File Categories

Define storage strategies for:

User avatars

Workspace assets

Project assets

Story images

Generated AI images

Generated AI documents

Prompt attachments

Export files

Temporary uploads

System files

Backups

Logs (if applicable)

Future asset types

---

# File Lifecycle

Document:

File creation

Upload

Validation

Virus scanning trigger

Metadata extraction

Persistence

Access

Versioning

Replacement

Archiving

Deletion

Permanent cleanup

---

# Upload Workflow

Document:

Client Upload Request

â†“

Validation

â†“

Storage Provider

â†“

Object Storage

â†“

Metadata

â†“

Repository

â†“

Response

---

# Download Workflow

Document:

Access validation

Signed URL generation

Expiration

Streaming

Caching

Audit logging

---

# Metadata Management

Document:

Object key

Filename

Content type

File size

Checksum

Hash

Version

Owner

Workspace

Project

Created At

Updated At

Storage provider

Storage region

Encryption status

Retention

---

# Storage Organization

Document:

Bucket strategy

Folder hierarchy

Workspace organization

Project organization

Asset organization

Temporary storage

Archive storage

Export storage

Naming conventions

Collision prevention

---

# Security

Document:

Signed URLs

Private buckets

Public buckets

Encryption at rest

Encryption in transit

Access control

Ownership validation

PII handling

Secret management

Audit logging

---

# File Validation

Document:

Allowed MIME types

Maximum file size

Minimum file size

Extension validation

Content validation

Checksum validation

Duplicate detection

Malware scanning integration

---

# Versioning

Document:

Object versioning

Replacement strategy

Rollback

Historical files

Retention policy

Cleanup

---

# Performance

Document:

Multipart upload

Chunked upload

Streaming download

Compression

CDN integration

Caching

Parallel uploads

Large file strategy

Bandwidth optimization

---

# Reliability

Document:

Retry strategy

Timeouts

Provider failover

Replication

Disaster recovery

Backup strategy

Integrity verification

Consistency guarantees

---

# Error Handling

Document:

Upload failure

Download failure

Permission denied

Object not found

Provider unavailable

Timeout

Corrupt file

Storage full

Quota exceeded

Retry behavior

---

# Storage Usage Rules

Document:

When files are uploaded

When files are deleted

When files are archived

When metadata is updated

Who owns cleanup

How orphaned files are handled

---

# Queue Integration

Document:

Thumbnail generation

AI image processing

Virus scanning

Large uploads

Background cleanup

Archive jobs

---

# Testing Requirements

Upload tests

Download tests

Signed URL tests

Security tests

Versioning tests

Performance tests

Provider failover tests

Large file tests

Integrity tests

---

# Storage Anti-Patterns

Explicitly prohibit:

Business logic

Database access

Repository access

HTTP handling

Hardcoded providers

Hardcoded bucket names

Hardcoded paths

Direct SDK usage outside providers

Provider-specific logic leaking into services

Public storage by default

---

# Future Compatibility

Document:

Multi-cloud

Hybrid storage

CDN support

Edge storage

Object replication

Cold storage

Lifecycle policies

Storage migration

Future providers

---

# Final Checklist

Confirm:

âœ“ Provider interface defined

âœ“ Provider factory documented

âœ“ Upload workflow documented

âœ“ Download workflow documented

âœ“ Metadata documented

âœ“ Storage organization documented

âœ“ Security documented

âœ“ Versioning documented

âœ“ Performance documented

âœ“ Reliability documented

âœ“ Testing documented

âœ“ Anti-patterns documented

---

# Output Requirements

Produce a professional engineering specification.

Use markdown.

Use architecture diagrams where appropriate.

Use tables extensively.

Do NOT generate implementation code.

Do NOT generate SDK code.

Do NOT generate TypeScript.

Only define storage architecture, provider contracts, workflows, responsibilities, and standards.

Target approximately 40â€“60 pages when exported to PDF.

This document becomes the canonical implementation reference for the Storage Provider Layer.