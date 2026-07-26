# Epic 00 — Project Bootstrap

> Status: **Complete (M0–M12 closed) — ready for Epic 01**

---

# Objective

Bootstrap the entire Project Genesis repository.

This Epic is responsible for preparing the development environment and project infrastructure before implementing any business functionality.

No product features should be implemented during this phase.

The goal is to establish a production-ready foundation that all future Epics will build upon.

---

# Scope

This Epic includes:

- Repository initialization
- Backend setup
- Frontend setup
- Shared packages
- Environment configuration
- Docker configuration
- CI/CD pipelines
- Logging infrastructure
- Testing infrastructure
- Queue infrastructure
- Provider abstractions
- Observability placeholders
- Folder structure
- Development tooling

The backend is a NestJS REST API in `server/`, and background processing uses NestJS Workers with BullMQ. `apps/web` is a Next.js App Router UI only; business APIs must not be implemented as Next.js Route Handlers.

---

# Out of Scope

This Epic does **NOT** include:

- Authentication
- Users
- Workspaces
- Projects
- Stories
- Characters
- Worlds
- Assets
- Prompt Templates
- AI Generation
- Search
- Export
- Notifications
- Business Logic
- APIs
- Database Schemas

These will be implemented in later Epics.

---

# Deliverables

At the end of this Epic the repository should include:

- Project folder structure
- Backend framework
- Frontend framework
- Shared packages
- Docker setup
- MongoDB configuration
- Redis configuration
- Configuration management
- Logger abstraction
- Health checks
- Queue registration
- Provider interfaces
- Testing setup
- CI/CD pipelines
- Linting
- Formatting
- Git hooks

The project should build successfully.

---

# Dependencies

Required before starting:

- Architecture Version 1.1
- All architecture documents
- Implementation Roadmap

---

# Success Criteria

This Epic is complete when:

- Project compiles successfully
- Lint passes
- Tests pass
- Docker starts correctly
- MongoDB connects
- Redis connects
- Backend starts
- Frontend starts
- CI pipeline succeeds
- Folder structure matches architecture

---

# Next Epic

After Project Bootstrap is complete, begin:

```
Epic 01 — Authentication
```

---

# Epic Files

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Epic overview |
| [tasks.md](./tasks.md) | Implementation task list |
| [checklist.md](./checklist.md) | Completion checklist |
| [review.md](./review.md) | Architecture review & sign-off |

---

# References

- `../../00-architecture/README.md`
- `../../00-architecture/29-implementation-roadmap.md`
- `../../00-architecture/30-project-skeleton.md`

---

# Status

| Item | Status |
|------|--------|
| Planning | ✅ Complete |
| Architecture | ✅ Complete |
| Bootstrap | ✅ Complete (M0–M12) — proceed to Epic 01 Authentication |
| Development | ➡️ Next: Epic 01 |

---

Project Genesis

Architecture Version **1.1**

Bootstrap (Epic 00) **Complete** — proceed to Epic 01 — Authentication