# Task

Create **20-ai-provider-spec.md**

This document defines the complete AI Provider Layer specification for Project Genesis.

âš ï¸ This is NOT an implementation document.

âš ï¸ Do NOT generate TypeScript.

âš ï¸ Do NOT generate provider classes.

âš ï¸ Do NOT generate SDK code.

âš ï¸ Do NOT generate API calls.

This document defines the contracts, responsibilities, provider abstraction, orchestration, reliability, security, and lifecycle of all AI integrations.

The architecture has already been finalized.

Never redesign the architecture.

---

# Architecture Status

Architecture Version: 1.1

Status: Frozen

The architecture is the single source of truth.

If implementation conflicts with architecture, architecture always wins.

Never expose provider-specific logic to the Service Layer.

Business logic must remain provider-independent.

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

Treat these documents as the canonical source of truth.

---

# Goal

Produce the canonical AI Provider specification.

This document must define how AI providers integrate with the platform while keeping the rest of the application completely provider-independent.

---

# Global AI Rules

AI Providers ONLY:

Communicate with external AI services

Convert requests

Convert responses

Normalize errors

Handle retries

Handle provider authentication

Handle provider-specific limitations

Handle provider-specific SDKs

Report usage metrics

Return normalized results

Providers NEVER:

Contain business logic

Access MongoDB

Use repositories

Access controllers

Access HTTP requests

Call Storage Providers

Call Queue Workers

Perform authorization

Perform authentication

Validate business rules

---

# Supported Providers

Design for:

Gemini

OpenAI

Claude

OpenRouter

Groq

Future providers

---

# AI Provider Architecture

Document:

AIService

â†“

Provider Factory

â†“

Provider Interface

â†“

Concrete Provider

â†“

External AI API

Explain each responsibility.

---

# Provider Interface

Define the standard contract every provider must implement.

Document:

Capabilities

Supported models

Input contract

Output contract

Streaming support

Token usage

Vision support

Image generation

Embeddings

Structured output

Function calling

Future compatibility

---

# Provider Factory

Document:

Provider selection

Model selection

Configuration loading

Fallback providers

Default provider

Health awareness

Cost awareness

Feature awareness

---

# Provider Configuration

Document:

API keys

Environment variables

Timeouts

Retry configuration

Rate limits

Default models

Fallback models

Regional configuration

---

# Request Lifecycle

Document:

Service Request

â†“

Prompt Builder

â†“

Provider Selection

â†“

Model Selection

â†“

Request Transformation

â†“

Provider API

â†“

Response Validation

â†“

Response Normalization

â†“

Service Layer

---

# Prompt Processing

Document:

Prompt templates

Variable substitution

Context injection

Conversation history

System prompts

User prompts

Safety prompts

Token estimation

Prompt validation

Prompt limits

---

# Response Processing

Document:

Normalization

Structured output

JSON parsing

Markdown handling

Image URLs

Token usage

Cost calculation

Metadata extraction

Error normalization

---

# Retry Strategy

Document:

Retry conditions

Backoff strategy

Maximum retries

Provider failover

Timeout behavior

Cancellation

Idempotency

---

# Error Handling

Document:

Authentication failures

Provider unavailable

Quota exceeded

Rate limited

Invalid prompt

Model unavailable

Timeout

Malformed response

Safety rejection

Unknown errors

Normalize all errors.

---

# Usage Tracking

Document:

Prompt tokens

Completion tokens

Image generation count

Latency

Provider used

Model used

Estimated cost

Request ID

Correlation ID

Audit logging

---

# AI Capabilities

Document support for:

Text Generation

Story Generation

Scene Generation

Character Generation

World Building

Prompt Expansion

Image Generation

Image Editing

Summarization

Translation

Embeddings

Future multimodal support

---

# Model Selection Rules

Document:

Default models

Premium models

Fast models

Cheap models

High-quality models

Fallback order

Automatic switching

Capability matching

---

# Security

API key protection

Secret management

Prompt injection protection

Output sanitization

Sensitive data masking

PII handling

Audit logging

Provider isolation

---

# Performance

Latency expectations

Streaming

Batch requests

Concurrency

Caching opportunities

Connection reuse

Timeouts

Circuit breaker strategy

---

# Reliability

Health checks

Provider failover

Automatic retries

Graceful degradation

Fallback responses

Maintenance mode

Disaster recovery

---

# Testing Requirements

Mock providers

Integration tests

Retry tests

Timeout tests

Streaming tests

Cost calculation tests

Fallback tests

Error normalization tests

Security tests

Performance tests

---

# Provider Anti-Patterns

Explicitly prohibit:

Business logic

Repository access

Database access

HTTP handling

Storage handling

Queue management

Direct controller usage

Provider-specific logic leaking into services

Hardcoded models

Hardcoded API keys

---

# Future Compatibility

Document support for:

New providers

Local LLMs

Self-hosted models

On-prem deployment

Fine-tuned models

Agent frameworks

Tool calling

MCP integration

Multi-provider orchestration

---

# Final Checklist

Confirm:

âœ“ Every provider defined

âœ“ Provider interface documented

âœ“ Factory documented

âœ“ Request lifecycle documented

âœ“ Response normalization documented

âœ“ Retry strategy documented

âœ“ Error handling documented

âœ“ Usage tracking documented

âœ“ Security documented

âœ“ Testing documented

âœ“ Anti-patterns documented

---

# Output Requirements

Produce a professional engineering specification.

Use markdown.

Use tables extensively.

Use architecture diagrams where useful.

Do NOT generate implementation code.

Do NOT generate SDK code.

Do NOT generate API requests.

Do NOT generate TypeScript.

Only define provider contracts, responsibilities, workflows, and architecture.

Target approximately 40â€“60 pages when exported to PDF.

This document becomes the canonical implementation reference for the AI Provider Layer.