# Domain Model

## Purpose

This document defines the business domain of Project Genesis.

It establishes the ownership, lifecycle, and relationships of all major business entities before designing the database schema.

This document is technology-independent and serves as the canonical business model for the platform.

---

# Domain Philosophy

Project Genesis treats creative work as structured, reusable knowledge.

The database owns the business data.

AI providers only consume and generate content.

Business entities must remain independent from any specific AI provider.

---

# Domain Hierarchy

```text
Workspace
│
├── Shared Library
│      ├── Characters
│      ├── Worlds
│      ├── Assets
│      └── Prompt Templates
│
└── Projects
       ├── Stories
       ├── Scenes
       ├── Generations
       ├── Exports
       └── Project Settings
```

---

# Root Aggregate

## Workspace

The Workspace is the root aggregate of the system.

Everything owned by a user exists inside a Workspace.

Responsibilities:

* Own shared resources
* Own projects
* Manage preferences
* Manage storage usage
* Manage future collaboration

---

# Shared Library

The Shared Library stores reusable business entities.

Objects inside the Shared Library are independent from any single project.

The Shared Library contains:

* Characters
* Worlds
* Assets
* Prompt Templates

Projects reference these entities instead of duplicating them.

---

# Project

A Project represents one creative production.

Examples:

* Film
* Advertisement
* Comic
* YouTube Video
* Story
* Animation
* Marketing Campaign

A project owns:

* Stories
* Scenes
* AI Generations
* Exports
* Project Settings

A project references:

* Characters
* Worlds
* Assets
* Prompt Templates

Projects never duplicate shared entities.

---

# Character

A Character is a reusable digital actor.

Characteristics:

* Independent
* Reusable
* Versionable

A Character contains:

* Identity
* Appearance
* Personality
* Biography
* Relationships
* Expressions
* Outfits
* Reference Assets

A Character may be referenced by:

* Multiple Projects
* Multiple Stories
* Multiple Scenes

---

# World

A World defines a reusable fictional environment.

A World contains:

* Locations
* Timeline
* Organizations
* Rules
* History
* Culture

A World may be referenced by multiple projects.

---

# Story

A Story belongs to exactly one Project.

A Story represents narrative structure.

A Story contains:

* Chapters (Optional)
* Scenes

A Story references:

* Characters
* Worlds

Stories are not shared between projects.

---

# Chapter

A Chapter is optional.

Its purpose is to organize long-form content.

Relationship:

```text
Story
   │
   ├── Scene
   ├── Scene
   └── Scene
```

or

```text
Story
   │
   ├── Chapter
   │      ├── Scene
   │      └── Scene
   │
   └── Chapter
```

---

# Scene

A Scene belongs to exactly one Story.

A Scene references:

* Characters
* Worlds
* Assets
* Prompt Template

A Scene owns:

* Scene Description
* Generated Results
* Timeline Position

---

# Asset

An Asset represents reusable media.

Examples:

* Images
* Videos
* Audio
* Documents
* References

Assets belong to the Workspace Shared Library.

Projects reference assets.

Assets should never be duplicated.

---

# Prompt Template

Prompt Templates store reusable AI instructions.

Templates are shared across projects.

A Prompt Template contains:

* Template Name
* Variables
* Instructions
* Version

Projects reference Prompt Templates.

---

# AI Generation

Generation represents one AI execution.

A Generation belongs to exactly one Project.

Generation references:

* Scene
* Character
* Prompt Template
* Assets

Generation stores:

* Provider
* Model
* Input
* Output
* Metadata
* Cost
* Duration
* Status

Generation records are immutable.

---

# Background Job

A Job represents asynchronous processing.

Examples:

* Image Generation
* Video Rendering
* AI Processing
* File Conversion
* Export

Jobs are system-owned.

Jobs reference business entities but do not own them.

---

# Export

Export belongs to one Project.

Export references:

* Scenes
* Assets
* Generated Outputs

Exports are generated artifacts.

---

# Relationships

## Workspace

Owns:

* Shared Library
* Projects

---

## Shared Library

Owns:

* Characters
* Worlds
* Assets
* Prompt Templates

---

## Project

Owns:

* Stories
* Generations
* Exports

References:

* Characters
* Worlds
* Assets
* Prompt Templates

---

## Story

Owns:

* Chapters (Optional)
* Scenes

References:

* Characters
* Worlds

---

## Scene

References:

* Characters
* Worlds
* Assets
* Prompt Templates

Owns:

* Generated Outputs

---

# Entity Ownership

| Entity          | Owner     |
| --------------- | --------- |
| Workspace       | User      |
| Character       | Workspace |
| World           | Workspace |
| Asset           | Workspace |
| Prompt Template | Workspace |
| Project         | Workspace |
| Story           | Project   |
| Chapter         | Story     |
| Scene           | Story     |
| Generation      | Project   |
| Job             | System    |
| Export          | Project   |

---

# Reference Rules

Projects never duplicate:

* Characters
* Worlds
* Assets
* Prompt Templates

Stories reference Characters and Worlds.

Scenes reference Characters, Worlds, Assets, and Prompt Templates.

Generations reference existing business entities.

---

# Lifecycle

```text
Workspace
      │
      ▼
Shared Library
      │
      ▼
Project
      │
      ▼
Story
      │
      ▼
Scene
      │
      ▼
Generation
      │
      ▼
Export
```

---

# Domain Rules

* Every Workspace owns its data.
* Shared entities must be reusable.
* Projects reference shared entities.
* Stories belong to one project only.
* Scenes belong to one story only.
* AI never owns business data.
* Jobs never own business data.
* Assets are referenced instead of copied.
* Every entity has a globally unique identifier.
* Every entity stores audit information.
* Every entity supports soft deletion where applicable.
* Business rules remain independent of AI providers.

---

# Future Extensions

The domain model supports future additions without breaking existing relationships.

Possible future entities include:

* Teams
* Workspace Members
* Collections
* Marketplace
* Plugins
* AI Agents
* Voice Profiles
* 3D Character Models
* Animation Library
* Motion Capture Data

---

# Dependencies

## Depends On

* 01-project-goal.md
* 03-product-requirements.md
* 04-system-concepts.md
* 05-user-flows.md
* 06-information-architecture.md

## Used By

* 08-database-design.md
* 09-api-design.md
* 10-architecture.md
* Repository Layer
* Service Layer
* Authorization Model
* Search Architecture
* AI Context Builder
