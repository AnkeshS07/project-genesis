# System Concepts

This document defines the core concepts and business entities used throughout Project Genesis.

Every developer, designer, AI workflow, API, and database model should use these definitions consistently.

These concepts represent the language of the platform and must remain consistent across the entire system.

---

# Core Philosophy

Project Genesis is built around structured creative data.

AI assists in generating content, but the platform owns and manages all project knowledge.

Every major entity should be reusable, versionable, and independent from any specific AI provider.

---

# Workspace

A Workspace is the highest-level container owned by a user.

It contains one or more creative projects.

Future versions may allow multiple users to collaborate inside a shared workspace.

A workspace contains:

* Projects
* Members (future)
* Settings
* Storage usage
* Billing (future)

---

# Project

A Project represents a complete creative work.

Examples include:

* Short Film
* YouTube Video
* Animation
* Comic Series
* Story Book
* Advertisement
* Marketing Campaign
* Game Narrative

A project contains:

* Characters
* Worlds
* Stories
* Scenes
* Assets
* AI Generations
* Exports

Projects are independent from each other.

---

# Character

A Character represents a reusable digital actor.

A character is **not** an image.

A character contains structured information such as:

* Name
* Appearance
* Personality
* Biography
* Relationships
* Voice (future)
* Expressions
* Outfits
* Reference Assets

A character can appear in multiple stories and multiple scenes.

Future versions may support:

* 3D Character Studio
* Character animations
* Motion capture
* Voice cloning

---

# World

A World defines the environment in which stories exist.

A world contains:

* Locations
* Rules
* Timeline
* Organizations
* Culture
* History
* Relationships

A world can be reused across multiple projects.

---

# Story

A Story represents the narrative of a project.

A story organizes creative content into logical sections.

A story contains:

* Chapters
* Scenes
* Plot
* Timeline
* Characters
* Worlds

A story belongs to one project.

---

# Chapter

A Chapter groups related scenes.

Chapters improve organization for large stories.

A chapter contains:

* Multiple scenes
* Narrative objectives
* Story progression

---

# Scene

A Scene represents the smallest narrative unit of a story.

A scene describes:

* Location
* Characters
* Dialogue
* Actions
* Mood
* Camera notes (optional)
* Visual references

Scenes are the primary input for AI image and video generation.

---

# Asset

An Asset is any reusable media file.

Examples include:

* Images
* Videos
* Audio
* Documents
* Reference images
* Generated outputs

Assets belong to projects but may be reused across different entities.

---

# Prompt

A Prompt represents reusable AI instructions.

Prompts should never be hardcoded throughout the application.

A prompt may contain:

* Variables
* Templates
* Context
* AI instructions

Prompts can be versioned and reused.

---

# Generation

A Generation represents one AI generation request.

Examples include:

* Character generation
* Story generation
* Image generation
* Video generation
* Music generation
* Voice generation

A generation stores:

* Input
* Output
* Provider
* Model
* Status
* Metadata

Generations are immutable historical records.

---

# Job

A Job represents a background process.

Examples include:

* Image generation
* Video rendering
* AI requests
* File processing
* Export generation

Jobs move through lifecycle states such as:

* Pending
* Processing
* Completed
* Failed
* Cancelled

---

# Export

An Export represents the final output produced from a project.

Examples include:

* Video
* Image package
* PDF
* Project archive

Exports are generated from structured project data.

---

# Template

A Template represents reusable project structure.

Templates may include:

* Character templates
* Story templates
* Prompt templates
* Project templates

Templates accelerate content creation.

---

# Version

A Version represents a snapshot of an entity at a point in time.

Entities that may support versioning include:

* Projects
* Characters
* Stories
* Prompts

Versioning enables rollback and history tracking.

---

# Relationship Summary

```text
Workspace
    │
    ├── Projects
    │
    ├── Project
    │      ├── Characters
    │      ├── Worlds
    │      ├── Stories
    │      ├── Assets
    │      ├── Generations
    │      └── Exports
    │
    ├── Story
    │      ├── Chapters
    │      └── Scenes
    │
    ├── Scene
    │      ├── Characters
    │      ├── Assets
    │      └── Prompts
    │
    └── Jobs
```

---

# General Rules

* Every entity has a unique identifier.
* Every entity has an owner.
* Every entity records creation and update timestamps.
* Entities should be reusable whenever possible.
* AI providers must never own business data.
* Assets should be referenced instead of duplicated.
* Background jobs should never modify business data directly without validation.
* Projects remain the primary organizational boundary of the platform.

---

# Terminology

| Term       | Definition                       |
| ---------- | -------------------------------- |
| Workspace  | Top-level container for projects |
| Project    | Complete creative work           |
| Character  | Reusable digital actor           |
| World      | Reusable fictional environment   |
| Story      | Narrative structure              |
| Chapter    | Group of related scenes          |
| Scene      | Smallest narrative unit          |
| Asset      | Reusable media resource          |
| Prompt     | Reusable AI instruction          |
| Generation | AI generation record             |
| Job        | Background processing task       |
| Export     | Final generated output           |
| Template   | Reusable starting structure      |
| Version    | Historical snapshot of an entity |
