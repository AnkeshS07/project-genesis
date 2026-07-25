# Information Architecture (IA)

## Purpose

This document defines how information is organized, structured, and navigated within Project Genesis.

It establishes the hierarchy of the application, relationships between modules, and navigation patterns.

This document is independent of UI design and implementation details.

---

# Core Principles

Project Genesis follows these principles:

* Everything belongs to a Workspace.
* Work happens inside Projects.
* Projects contain structured creative entities.
* Every major entity should be reusable.
* Users should navigate using logical relationships instead of searching through unrelated pages.
* AI assists the workflow but never becomes the primary navigation.

---

# Application Hierarchy

```text
Workspace
│
├── Dashboard
│
├── Projects
│     │
│     ├── Project A
│     ├── Project B
│     └── Project C
│
├── Profile
│
└── Settings
```

---

# Workspace Structure

The Workspace is the highest-level container for all user-owned data.

It contains:

* Dashboard
* Projects
* User Profile
* Settings

Future versions may include:

* Team Members
* Billing
* Shared Workspaces

---

# Dashboard

The Dashboard provides an overview of the user's activity.

Sections include:

* Recent Projects
* Continue Working
* Recent AI Generations
* Recent Assets
* Notifications
* Quick Actions

Typical navigation:

```text
Dashboard
│
├── Recent Projects
├── New Project
├── AI Activity
├── Notifications
└── Settings
```

---

# Project List

The Projects section displays all user-created projects.

Available actions:

* Create Project
* Open Project
* Duplicate
* Archive
* Delete
* Search
* Filter
* Sort

---

# Project Hierarchy

Every project acts as an isolated creative workspace.

```text
Project
│
├── Overview
├── Characters
├── Worlds
├── Stories
├── Scenes
├── Assets
├── Prompt Library
├── AI Generation
├── Video Generation
├── Exports
└── Project Settings
```

---

# Project Overview

The Project Overview provides a summary of the project.

Information includes:

* Project Name
* Description
* Status
* Last Updated
* Recent Activity
* Recent Assets
* Recent Characters
* Recent Stories

Quick actions:

* Continue Working
* Generate Content
* Export

---

# Character Studio

The Character Studio manages reusable characters.

Hierarchy:

```text
Characters
│
├── Character List
│
└── Character Details
      │
      ├── Basic Information
      ├── Appearance
      ├── Personality
      ├── Relationships
      ├── Expressions
      ├── Outfits
      ├── Reference Assets
      └── Generation History
```

Future modules:

* 3D Character Studio
* Animation
* Voice

---

# World Builder

Hierarchy:

```text
Worlds
│
├── World List
│
└── World Details
      │
      ├── Locations
      ├── Timeline
      ├── Organizations
      ├── Rules
      ├── History
      └── Relationships
```

---

# Story Manager

Hierarchy:

```text
Stories
│
├── Story List
│
└── Story
      │
      ├── Overview
      ├── Chapters (Optional)
      ├── Scenes
      ├── Characters
      └── Timeline
```

---

# Scene Manager

Scenes are the smallest narrative unit.

Hierarchy:

```text
Scenes
│
├── Scene List
│
└── Scene
      │
      ├── Title
      ├── Description
      ├── Characters
      ├── Location
      ├── Assets
      ├── Prompt
      ├── AI Generation
      └── History
```

---

# Asset Library

The Asset Library stores reusable media.

Hierarchy:

```text
Assets
│
├── Images
├── Videos
├── Audio
├── Documents
├── References
└── Generated Files
```

Each asset may belong to multiple entities through references.

---

# Prompt Library

Reusable AI prompts.

Hierarchy:

```text
Prompt Library
│
├── Templates
├── Saved Prompts
├── Categories
└── Versions
```

---

# AI Generation

The AI Generation module stores generation requests.

Hierarchy:

```text
AI Generation
│
├── Character
├── Story
├── Scene
├── Image
├── Video
├── Voice (Future)
└── Music (Future)
```

Each generation stores:

* Prompt
* Context
* Provider
* Model
* Status
* Output

---

# Video Generation

Hierarchy:

```text
Video Generation
│
├── Jobs
├── Queue
├── Render History
└── Completed Videos
```

---

# Export Center

Hierarchy:

```text
Exports
│
├── Images
├── Videos
├── Documents
└── Archives
```

---

# Profile

Contains:

* Personal Information
* Avatar
* Preferences
* API Usage
* Account Information

---

# Settings

Contains:

* General
* AI Providers
* Storage
* Notifications
* Security
* Appearance

Future:

* Billing
* Teams
* Integrations

---

# Navigation Structure

Primary Navigation

```text
Dashboard

Projects

Profile

Settings
```

Inside Project

```text
Overview

Characters

Worlds

Stories

Scenes

Assets

Prompt Library

AI Generation

Video Generation

Exports

Settings
```

---

# Breadcrumb Structure

Examples:

```text
Workspace
>
Projects
>
Fantasy Movie
>
Characters
>
John Carter
```

---

```text
Workspace
>
Projects
>
Fantasy Movie
>
Stories
>
Chapter 1
>
Scene 3
```

---

# Search Architecture

Global Search

Searches across:

* Projects
* Characters
* Worlds
* Stories
* Scenes
* Assets

Context Search

Searches only inside the current module.

---

# Relationship Diagram

```text
Workspace
│
├── Dashboard
│
├── Projects
│      │
│      ├── Overview
│      ├── Characters
│      ├── Worlds
│      ├── Stories
│      │      └── Chapters (Optional)
│      │              └── Scenes
│      ├── Assets
│      ├── Prompt Library
│      ├── AI Generation
│      ├── Video Generation
│      └── Exports
│
├── Profile
│
└── Settings
```

---

# Information Ownership

| Entity     | Owner     |
| ---------- | --------- |
| Workspace  | User      |
| Project    | Workspace |
| Character  | Project   |
| World      | Project   |
| Story      | Project   |
| Chapter    | Story     |
| Scene      | Story     |
| Asset      | Project   |
| Prompt     | Project   |
| Generation | Project   |
| Job        | System    |
| Export     | Project   |

---

# Design Guidelines

* Keep navigation shallow whenever possible.
* Every entity should have a predictable location.
* Users should never lose context while navigating.
* Frequently used modules should require minimal clicks.
* Navigation should scale as the platform grows.
* Search should complement navigation, not replace it.
* Relationships should be explicit rather than inferred.

---

# Dependencies

## Depends On

* 01-project-goal.md
* 03-product-requirements.md
* 04-system-concepts.md
* 05-user-flows.md

## Used By

* 07-database-design.md
* 08-api-design.md
* 09-architecture.md
* UI/UX Design
* Navigation Components
* Frontend Routing
