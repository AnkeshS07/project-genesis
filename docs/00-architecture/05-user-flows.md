# User Flows

This document defines how users interact with Project Genesis.

It describes the complete journey from authentication to creating and managing creative projects.

These flows are implementation-independent and serve as the foundation for UI design, API design, database design, and system architecture.

---

# User Flow Overview

```text
Landing Page
      │
      ▼
Authentication
      │
      ▼
Dashboard
      │
      ▼
Projects
      │
      ▼
Project Workspace
      │
      ├──────────────┬───────────────┬──────────────┐
      ▼              ▼               ▼              ▼
Characters       Worlds         Stories        Assets
      │              │               │              │
      └──────────────┴───────────────┘              │
                     ▼                              │
                 Scene Manager                      │
                     ▼                              │
                AI Generation                       │
                     ▼                              │
                Review Output                       │
                     ▼                              │
                Save to Project ◄───────────────────┘
                     ▼
             Video Generation
                     ▼
                  Export
```

---

# 1. Authentication Flow

## Goal

Allow users to securely access their workspace.

## Flow

```text
Landing Page
      ↓
Register
      ↓
Email Verification (Optional)
      ↓
Login
      ↓
Dashboard
```

---

# 2. Dashboard Flow

## Goal

Provide quick access to all creative work.

## User Actions

* View recent projects
* Create new project
* Open existing project
* View AI activity
* View recent assets
* Open settings

## Flow

```text
Dashboard
      ↓
Create Project
      │
      ├── OR
      │
Open Existing Project
      ↓
Project Workspace
```

---

# 3. Project Flow

## Goal

Manage creative projects.

## User Actions

* Create project
* Edit project
* Archive project
* Delete project
* Duplicate project

## Flow

```text
Dashboard
      ↓
New Project
      ↓
Project Information
      ↓
Project Workspace
```

---

# 4. Project Workspace Flow

The project workspace acts as the central hub.

Modules available inside every project:

* Character Studio
* World Builder
* Story Manager
* Scene Manager
* Asset Library
* Prompt Library
* AI Generation
* Video Generation
* Export

```text
Project Workspace
      │
      ├── Characters
      ├── Worlds
      ├── Stories
      ├── Scenes
      ├── Assets
      ├── Prompts
      ├── AI
      └── Export
```

---

# 5. Character Studio Flow

## Goal

Create reusable digital characters.

## User Actions

* Create character
* Edit appearance
* Upload references
* Manage outfits
* Manage expressions
* Save character
* Reuse character

## Flow

```text
Project
      ↓
Character Studio
      ↓
Create Character
      ↓
Configure Character
      ↓
Save
      ↓
Available Across Project
```

Future versions may include:

* 3D Character Studio
* 360° Character Viewer
* Animation Preview

---

# 6. World Builder Flow

## Goal

Create reusable fictional worlds.

## User Actions

* Create world
* Add locations
* Define rules
* Define history
* Save world

## Flow

```text
Project
      ↓
World Builder
      ↓
Create World
      ↓
Add Locations
      ↓
Save
```

---

# 7. Story Flow

## Goal

Organize narratives.

## User Actions

* Create story
* Edit story
* Organize chapters (optional)
* Create scenes

## Flow

```text
Project
      ↓
Story Manager
      ↓
Create Story
      ↓
Chapter (Optional)
      ↓
Scenes
```

---

# 8. Scene Flow

## Goal

Create individual story scenes.

## User Actions

* Add title
* Select location
* Add characters
* Add description
* Generate scene
* Save

## Flow

```text
Story
      ↓
Scene
      ↓
Add Details
      ↓
Generate
      ↓
Review
      ↓
Save
```

---

# 9. Asset Library Flow

## Goal

Store reusable creative assets.

## User Actions

* Upload asset
* Browse assets
* Search assets
* Organize assets
* Attach assets to projects

## Flow

```text
Upload
      ↓
Asset Library
      ↓
Categorize
      ↓
Reuse
```

---

# 10. Prompt Library Flow

## Goal

Reuse AI prompts.

## User Actions

* Create prompt
* Save prompt
* Edit prompt
* Categorize prompt
* Reuse prompt

## Flow

```text
Prompt Library
      ↓
Create Prompt
      ↓
Save
      ↓
Reuse
```

---

# 11. AI Generation Flow

## Goal

Generate AI-assisted content.

## Supported Generation Types

* Character
* Story
* Scene
* Image
* Video
* Voice (Future)
* Music (Future)

## Flow

```text
Select Entity
      ↓
Select Prompt
      ↓
Generate
      ↓
Processing
      ↓
Preview
      ↓
Accept or Regenerate
      ↓
Save
```

---

# 12. Video Generation Flow

## Goal

Generate videos from structured project data.

## Flow

```text
Project
      ↓
Story
      ↓
Scenes
      ↓
Images
      ↓
Voice (Optional)
      ↓
Music (Optional)
      ↓
Generate Video
      ↓
Render
      ↓
Export
```

---

# 13. Export Flow

## Goal

Export completed work.

## User Actions

* Select export type
* Configure options
* Export
* Download

## Flow

```text
Project
      ↓
Export
      ↓
Choose Format
      ↓
Generate Export
      ↓
Download
```

---

# Error Flow

If any operation fails:

```text
Action
      ↓
Validation
      ↓
Failure
      ↓
Error Message
      ↓
Retry
```

---

# Background Job Flow

Long-running tasks should execute asynchronously.

```text
User Action
      ↓
Create Job
      ↓
Queue
      ↓
Processing
      ↓
Completed
      ↓
Notify User
```

---

# Overall User Journey

```text
Landing Page
      ↓
Register/Login
      ↓
Dashboard
      ↓
Create Project
      ↓
Character Studio
      ↓
World Builder
      ↓
Story Manager
      ↓
Scene Manager
      ↓
Asset Library
      ↓
AI Generation
      ↓
Review Output
      ↓
Video Generation
      ↓
Export
```

---

# Design Principles

* Every project starts from a workspace.
* Characters are reusable across stories and scenes.
* Worlds are reusable across projects when appropriate.
* Stories organize scenes.
* Scenes drive AI generation.
* Assets are reusable and searchable.
* AI assists the workflow but does not replace structured project data.
* Long-running operations execute in the background.
* Users should never lose work because of AI failures.

---

# Dependencies

## Depends On

* 01-project-goal.md
* 03-product-requirements.md
* 04-system-concepts.md

## Used By

* 06-information-architecture.md
* 07-database-design.md
* 08-api-design.md
* 09-architecture.md
* UI/UX Design
* Backend Services
