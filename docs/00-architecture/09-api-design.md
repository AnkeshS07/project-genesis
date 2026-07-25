# API Design

## Purpose

This document defines the REST API architecture for Project Genesis.

It establishes API conventions, endpoint organization, authentication strategy, request/response formats, versioning, and resource design.

This document serves as the canonical reference for backend API implementation.

---

# API Philosophy

Project Genesis follows a Resource-Oriented REST architecture.

Principles:

* RESTful endpoints
* Stateless requests
* JSON request/response
* Predictable resource naming
* Consistent error handling
* Versioned APIs
* Idempotent operations where applicable
* Authentication before business logic
* Validation before persistence

---

# Base URL

The backend API is a NestJS REST application in `server/`. All domain HTTP endpoints are served at this base path; `apps/web` is UI-only and does not implement business API Route Handlers.

```
/api/v1
```

Example

```
/api/v1/projects
```

---

# API Versioning

Current Version

```
v1
```

Future versions

```
/api/v2
/api/v3
```

Older versions remain supported until officially deprecated.

---

# Authentication

Authentication Method

* JWT Access Token
* Refresh Token

Authorization Header

```
Authorization: Bearer <access_token>
```

Public APIs

* Login
* Register
* Forgot Password
* Reset Password
* Refresh Token

All remaining endpoints require authentication.

---

# Standard Response Format

## Success

```json
{
  "success": true,
  "data": {}
}
```

---

## Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed"
  }
}
```

---

# HTTP Status Codes

| Status | Meaning               |
| ------ | --------------------- |
| 200    | Success               |
| 201    | Created               |
| 204    | Deleted Successfully  |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 403    | Forbidden             |
| 404    | Not Found             |
| 409    | Conflict              |
| 422    | Validation Error      |
| 429    | Rate Limited          |
| 500    | Internal Server Error |

---

# Authentication APIs

```
POST   /auth/register

POST   /auth/login

POST   /auth/refresh

POST   /auth/logout

POST   /auth/forgot-password

POST   /auth/reset-password

GET    /auth/me
```

---

# User APIs

```
GET    /users/me

PATCH  /users/me

DELETE /users/me

PATCH  /users/avatar
```

---

# Workspace APIs

```
GET    /workspaces/current

PATCH  /workspaces/current

GET    /workspaces/statistics
```

---

# Project APIs

```
GET    /projects

POST   /projects

GET    /projects/:projectId

PATCH  /projects/:projectId

DELETE /projects/:projectId

POST   /projects/:projectId/archive

POST   /projects/:projectId/duplicate
```

---

# Character APIs

```
GET    /characters

POST   /characters

GET    /characters/:characterId

PATCH  /characters/:characterId

DELETE /characters/:characterId

POST   /characters/:characterId/reference-assets

DELETE /characters/:characterId/reference-assets/:assetId
```

---

# World APIs

```
GET    /worlds

POST   /worlds

GET    /worlds/:worldId

PATCH  /worlds/:worldId

DELETE /worlds/:worldId
```

---

# Story APIs

```
GET    /projects/:projectId/stories

POST   /projects/:projectId/stories

GET    /stories/:storyId

PATCH  /stories/:storyId

DELETE /stories/:storyId
```

---

# Chapter APIs

```
GET    /stories/:storyId/chapters

POST   /stories/:storyId/chapters

PATCH  /chapters/:chapterId

DELETE /chapters/:chapterId
```

---

# Scene APIs

```
GET    /stories/:storyId/scenes

POST   /stories/:storyId/scenes

GET    /scenes/:sceneId

PATCH  /scenes/:sceneId

DELETE /scenes/:sceneId
```

---

# Asset APIs

```
GET    /assets

POST   /assets/upload

GET    /assets/:assetId

DELETE /assets/:assetId

PATCH  /assets/:assetId
```

---

# Prompt Template APIs

```
GET    /prompt-templates

POST   /prompt-templates

GET    /prompt-templates/:templateId

PATCH  /prompt-templates/:templateId

DELETE /prompt-templates/:templateId
```

---

# AI Generation APIs

```
POST   /generations

GET    /generations

GET    /generations/:generationId

DELETE /generations/:generationId

POST   /generations/:generationId/retry
```

---

# Background Job APIs

```
GET    /jobs

GET    /jobs/:jobId

POST   /jobs/:jobId/cancel
```

---

# Export APIs

```
POST   /exports

GET    /exports

GET    /exports/:exportId

DELETE /exports/:exportId
```

---

# Notification APIs

```
GET    /notifications

PATCH  /notifications/:notificationId/read

PATCH  /notifications/read-all
```

---

# Search APIs

```
GET /search?q=
```

Supported Resources

* Projects
* Characters
* Worlds
* Stories
* Scenes
* Assets

---

# Pagination

Request

```
?page=1&limit=20
```

Response

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 200,
    "totalPages": 10
  }
}
```

---

# Filtering

Example

```
GET /projects?status=active
```

---

# Sorting

Example

```
GET /projects?sort=updatedAt:desc
```

---

# Searching

Example

```
GET /projects?search=fantasy
```

---

# Validation Rules

* Validate every request.
* Reject unknown fields.
* Validate ownership.
* Validate references.
* Validate permissions.

---

# File Upload Flow

```
Client

↓

Upload API

↓

Object Storage

↓

Metadata Saved

↓

Asset Created

↓

Response
```

---

# AI Generation Flow

```
Client

↓

Generation API

↓

Job Created

↓

Queue

↓

AI Provider

↓

Save Result

↓

Complete
```

---

# Error Codes

| Code              | Description             |
| ----------------- | ----------------------- |
| VALIDATION_ERROR  | Invalid Request         |
| UNAUTHORIZED      | Authentication Required |
| FORBIDDEN         | Permission Denied       |
| NOT_FOUND         | Resource Not Found      |
| CONFLICT          | Resource Conflict       |
| RATE_LIMITED      | Too Many Requests       |
| AI_PROVIDER_ERROR | AI Provider Failed      |
| JOB_FAILED        | Background Job Failed   |
| EXPORT_FAILED     | Export Failed           |

---

# Security Rules

* JWT Authentication
* Rate Limiting
* Request Validation
* Ownership Verification
* Input Sanitization
* Audit Logging

---

# API Naming Rules

Resources

```
Plural
```

Examples

```
/projects

/characters

/worlds
```

Path Parameters

```
:projectId

:storyId

:sceneId
```

Actions

Use HTTP verbs instead of action names whenever possible.

Good

```
POST /projects

PATCH /projects/:id
```

Avoid

```
POST /createProject
```

---

# API Lifecycle

```
Client

↓

Middleware

↓

Authentication

↓

Validation

↓

Authorization

↓

NestJS Controller

↓

Service

↓

Repository

↓

Database

↓

Response
```

---

# Dependencies

## Depends On

* 01-project-goal.md
* 03-product-requirements.md
* 04-system-concepts.md
* 05-user-flows.md
* 06-information-architecture.md
* 07-domain-model.md
* 08-database-design.md

## Used By

* 10-architecture.md
* NestJS Controllers
* Services
* Repository Layer
* Frontend API Client
* SDK Generation
* API Documentation
