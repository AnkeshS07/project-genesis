# Database Design

## Purpose

This document defines the logical database design for Project Genesis.

It specifies the collections, relationships, indexing strategy, naming conventions, document ownership, and database rules.

This document is the canonical reference for implementing MongoDB collections and Mongoose models.

---

# Database Philosophy

Project Genesis stores structured creative knowledge.

The database is the single source of truth.

AI providers never own business data.

Business entities should be reusable whenever possible.

Large binary files are stored in Object Storage.

The database stores only metadata and references.

---

# Database Technology

Database Type

* MongoDB

ODM

* Mongoose

Primary Identifier

* MongoDB ObjectId

Relationship Strategy

* Reference-Based

Binary Storage

* Object Storage (Cloudflare R2 / S3 Compatible)

Cache

* Redis

---

# Collection Overview

```text
users

workspaces

projects

characters

worlds

stories

chapters

scenes

assets

prompt_templates

generations

jobs

exports

activity_logs

notifications
```

---

# Entity Relationships

```text
User
│
└── Workspace
      │
      ├── Characters
      ├── Worlds
      ├── Assets
      ├── Prompt Templates
      │
      └── Projects
              │
              ├── Stories
              │      ├── Chapters (Optional)
              │      └── Scenes
              │
              ├── Generations
              └── Exports
```

---

# Common Fields

Every collection should include:

```text
_id

createdAt

updatedAt

createdBy

updatedBy

deletedAt

isDeleted

version
```

Notes

* Soft deletion is enabled.
* Version increments on updates.
* Audit fields are mandatory.

---

# Collection Details

## users

Purpose

Stores authentication and user profile information.

References

```text
Workspace
```

Contains

* Name
* Email
* Password Hash
* Avatar
* Role
* Status
* Preferences

---

## workspaces

Purpose

Top-level ownership boundary.

Contains

* Name
* Owner
* Settings
* Storage Usage
* Usage Statistics

References

```text
User
```

Owns

* Projects
* Characters
* Worlds
* Assets
* Prompt Templates

---

## projects

Purpose

Represents a creative production.

Contains

* Name
* Description
* Status
* Thumbnail
* Tags

References

```text
Workspace

Characters[]

Worlds[]

Assets[]

PromptTemplates[]
```

Owns

* Stories
* Generations
* Exports

---

## characters

Purpose

Reusable digital actors.

Contains

* Name
* Biography
* Appearance
* Personality
* Relationships
* Expressions
* Outfits
* Metadata

References

```text
Workspace

ReferenceAssets[]
```

Referenced By

* Projects
* Stories
* Scenes

---

## worlds

Purpose

Reusable fictional environments.

Contains

* Name
* Timeline
* Rules
* History
* Culture
* Locations

References

```text
Workspace
```

Referenced By

* Projects
* Stories
* Scenes

---

## stories

Purpose

Narrative structure.

Contains

* Title
* Summary
* Status
* Timeline

References

```text
Project

Characters[]

Worlds[]
```

Owns

* Chapters
* Scenes

---

## chapters

Purpose

Optional organization layer.

Contains

* Title
* Order
* Summary

References

```text
Story
```

Owns

* Scenes

---

## scenes

Purpose

Smallest narrative unit.

Contains

* Title
* Description
* Order
* Timeline Position

References

```text
Story

Characters[]

Worlds[]

Assets[]

PromptTemplate
```

Contains

* Generated Output References

---

## assets

Purpose

Reusable media metadata.

Contains

* Name
* File Type
* MIME Type
* Size
* Storage Key
* URL
* Thumbnail
* Metadata

References

```text
Workspace
```

Referenced By

* Characters
* Scenes
* Projects
* Generations

---

## prompt_templates

Purpose

Reusable AI instructions.

Contains

* Name
* Category
* Variables
* Prompt Template
* Version

References

```text
Workspace
```

---

## generations

Purpose

History of AI executions.

Contains

* Type
* Provider
* Model
* Prompt
* Input
* Output
* Metadata
* Cost
* Duration
* Status

References

```text
Project

Scene

PromptTemplate

Assets[]
```

Generation records are immutable.

---

## jobs

Purpose

Background processing.

Contains

* Type
* Status
* Queue Name
* Progress
* Retry Count
* Started At
* Completed At
* Error

References

```text
Generation

Export
```

---

## exports

Purpose

Final generated outputs.

Contains

* Name
* Format
* Storage Key
* URL
* Size

References

```text
Project

Assets[]

Scenes[]
```

---

## activity_logs

Purpose

Tracks important user actions.

Contains

* Action
* Entity
* Entity Id
* Timestamp
* Metadata

References

```text
User

Workspace
```

---

## notifications

Purpose

Stores user notifications.

Contains

* Title
* Message
* Type
* Read Status

References

```text
User
```

---

# Reference Strategy

Always use references for:

* Characters
* Worlds
* Assets
* Prompt Templates
* Stories
* Scenes

Avoid embedding large business entities.

Embedding is allowed only for:

* Small configuration objects
* UI preferences
* Metadata
* Settings

---

# File Storage Strategy

Database stores only:

```text
Asset Metadata

Storage Key

Public URL

Thumbnail URL

Metadata
```

Actual files remain in Object Storage.

---

# Indexing Strategy

## users

Unique

* Email

Indexes

* Role
* Status

---

## workspaces

Indexes

* Owner

---

## projects

Indexes

* Workspace
* Status
* UpdatedAt
* Tags

---

## characters

Indexes

* Workspace
* Name

---

## worlds

Indexes

* Workspace
* Name

---

## stories

Indexes

* Project
* Status

---

## scenes

Indexes

* Story
* Order

---

## assets

Indexes

* Workspace
* File Type
* Created At

---

## generations

Indexes

* Project
* Status
* Provider
* Created At

---

## jobs

Indexes

* Status
* Queue Name

---

## exports

Indexes

* Project
* Created At

---

# Naming Conventions

Collections

```text
Plural

users

projects

stories
```

Fields

```text
camelCase
```

Reference Fields

```text
workspaceId

projectId

storyId

sceneId

characterIds

assetIds
```

Boolean Fields

```text
isDeleted

isPublished

isArchived
```

Timestamp Fields

```text
createdAt

updatedAt

deletedAt
```

---

# Audit Strategy

Every entity stores:

* Creator
* Last Editor
* Created Time
* Updated Time
* Version

Critical entities additionally maintain activity history through `activity_logs`.

---

# Soft Delete Strategy

Entities are never permanently deleted immediately.

Deletion updates:

```text
isDeleted = true

deletedAt = Timestamp
```

Background cleanup may permanently remove data based on retention policies.

---

# Versioning Strategy

Version-supported entities:

* Characters
* Worlds
* Stories
* Prompt Templates

Every update increments the version number.

Historical versions may be retained in future releases.

---

# Transaction Strategy

Use MongoDB transactions for operations involving multiple collections.

Examples:

* Project creation
* Export generation
* Character creation with assets
* AI generation persistence

---

# Data Integrity Rules

* Every Project belongs to one Workspace.
* Every Story belongs to one Project.
* Every Scene belongs to one Story.
* Every Character belongs to one Workspace.
* Every World belongs to one Workspace.
* Every Asset belongs to one Workspace.
* Every Prompt Template belongs to one Workspace.
* Every Generation belongs to one Project.
* Every Export belongs to one Project.
* Jobs never own business entities.
* References must always point to existing documents.
* Business entities must never be duplicated unnecessarily.

---

# Scalability Guidelines

* Use reference-based relationships.
* Avoid deeply nested documents.
* Keep document sizes small.
* Offload binary files to Object Storage.
* Move long-running work to background jobs.
* Cache frequently accessed data in Redis.
* Archive old activity logs if needed.

---

# Dependencies

## Depends On

* 01-project-goal.md
* 03-product-requirements.md
* 04-system-concepts.md
* 05-user-flows.md
* 06-information-architecture.md
* 07-domain-model.md

## Used By

* 09-api-design.md
* 10-architecture.md
* Mongoose Schemas
* Repository Layer
* Service Layer
* Search System
* Background Workers
