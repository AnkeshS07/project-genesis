# Task

Create **21-ai-prompt-engine-spec.md**

This document defines the complete AI Prompt Engine architecture for Project Genesis.

âš ï¸ This is NOT an implementation document.

âš ï¸ Do NOT generate prompt templates.

âš ï¸ Do NOT generate TypeScript.

âš ï¸ Do NOT generate code.

âš ï¸ Do NOT write actual prompts.

This document defines how prompts are designed, composed, versioned, validated, managed, and executed.

The architecture has already been finalized.

Never redesign the architecture.

---

# Architecture Status

Architecture Version: 1.1

Status: Frozen

The Prompt Engine must remain independent from AI Providers.

AI Providers execute prompts.

Prompt Engine builds prompts.

Services request prompt generation.

Never mix these responsibilities.

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

Treat these as the canonical source of truth.

---

# Goal

Produce the canonical Prompt Engine specification.

The Prompt Engine is responsible for transforming business requests into high-quality AI prompts while remaining completely independent of any AI provider.

---

# Prompt Engine Responsibilities

The Prompt Engine MAY:

Build prompts

Load prompt templates

Resolve variables

Inject context

Inject memory

Inject workspace data

Apply safety rules

Apply formatting rules

Estimate token usage

Validate prompts

Version prompts

Optimize prompts

Return finalized prompts

The Prompt Engine MUST NOT:

Call AI providers

Access MongoDB directly

Access repositories

Perform business logic

Handle HTTP requests

Handle authentication

Handle authorization

Generate responses

Persist business data

---

# Prompt Engine Architecture

Document:

Service

â†“

Prompt Engine

â†“

Prompt Builder

â†“

Context Builder

â†“

Variable Resolver

â†“

Template Loader

â†“

Prompt Validator

â†“

Prompt Optimizer

â†“

Prompt Version Manager

â†“

Final Prompt

Explain each component.

---

# Prompt Categories

Design specifications for:

Story Generation

Scene Generation

Chapter Generation

Character Generation

Character Dialogue

Character Backstory

World Building

World Rules

Timeline Creation

Lore Generation

Image Prompt

Image Editing Prompt

Prompt Expansion

Rewrite Prompt

Summarization

Translation

Critique

Brainstorming

Idea Generation

Future Prompt Types

---

# Prompt Lifecycle

Document:

Business Request

â†“

Template Selection

â†“

Variable Resolution

â†“

Context Loading

â†“

Memory Injection

â†“

Safety Injection

â†“

Prompt Validation

â†“

Prompt Optimization

â†“

Token Estimation

â†“

Final Prompt

â†“

AI Provider

---

# Prompt Templates

Document:

Template organization

Naming conventions

Categories

Variables

Inheritance

Reusable blocks

Shared templates

Workspace templates

Project templates

Versioning

Deprecation

---

# Variable Resolution

Document:

Workspace variables

Project variables

Story variables

Character variables

World variables

Scene variables

Asset variables

User variables

Dynamic variables

Computed variables

Fallback values

Validation

---

# Context Management

Document:

Workspace context

Project context

Story context

Previous chapters

Previous scenes

Characters

Relationships

Lore

Timeline

Assets

Memory limits

Context prioritization

Context trimming

---

# Memory Strategy

Document:

Conversation memory

Generation history

Persistent memory

Temporary memory

Sliding window

Context window management

Token budgeting

Memory expiration

---

# Prompt Validation

Document:

Required variables

Missing variables

Invalid variables

Token limits

Template validation

Formatting validation

Safety validation

Business validation

---

# Prompt Optimization

Document:

Prompt cleanup

Duplicate removal

Compression

Formatting

Readability

Token reduction

Context prioritization

Provider optimization

---

# Structured Output

Document:

JSON output

Markdown output

Rich text

Tables

Lists

Code blocks

Schema validation

Output normalization

---

# Prompt Versioning

Document:

Version identifiers

Change history

Rollback

Migration

Compatibility

Testing

Deprecation

---

# Safety Layer

Document:

Prompt injection prevention

Data leakage prevention

PII masking

Workspace isolation

Forbidden instructions

Prompt sanitization

Content moderation

Safety prompts

---

# Token Management

Document:

Token estimation

Maximum tokens

Reserved tokens

Context budget

Completion budget

Overflow handling

Cost estimation

---

# Performance

Document:

Caching

Reusable prompts

Compiled templates

Context caching

Template caching

Parallel context loading

Optimization strategies

---

# Testing Requirements

Template validation

Variable resolution tests

Context tests

Prompt optimization tests

Safety tests

Token estimation tests

Structured output tests

Regression tests

Performance tests

---

# Prompt Engine Anti-Patterns

Explicitly prohibit:

Hardcoded prompts

Business logic in prompts

Provider-specific prompts

Prompt duplication

Large monolithic prompts

Missing variable validation

No versioning

No safety validation

No context limits

---

# Future Compatibility

Document:

Prompt chaining

Agent workflows

Multi-step prompting

Tool calling

Function calling

Reasoning models

Self-reflection

Memory improvements

Prompt marketplace

Custom user prompts

---

# Final Checklist

Confirm:

âœ“ Prompt architecture documented

âœ“ Prompt lifecycle documented

âœ“ Template system documented

âœ“ Variable resolution documented

âœ“ Context management documented

âœ“ Memory strategy documented

âœ“ Validation documented

âœ“ Optimization documented

âœ“ Structured output documented

âœ“ Versioning documented

âœ“ Safety documented

âœ“ Testing documented

---

# Output Requirements

Produce a professional engineering specification.

Use markdown.

Use architecture diagrams where appropriate.

Use tables extensively.

Do NOT generate prompt text.

Do NOT generate code.

Do NOT generate TypeScript.

Only define the Prompt Engine architecture, workflows, contracts, and standards.

Target approximately 50â€“70 pages when exported to PDF.

This document becomes the canonical implementation reference for the AI Prompt Engine.