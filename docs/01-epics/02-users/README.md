# Epic 02 — Users

> Status: **Not Started — planning approved after Epic 01 closure**

Architecture Version: **1.1 (Frozen)**

---

# Objective

Extend the identity foundation from Epic 01 into a full **user profile domain**: readable profile, editable preferences, avatar management, and account lifecycle (update / delete), without introducing workspace or project ownership.

Epic 02 owns **`/users/*` APIs** and profile persistence. Epic 01 retains **`/auth/*`** for credentials, sessions, and identity bootstrap (`GET /auth/me`).

---

# Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Epic 00 Bootstrap | ✅ Complete | Monorepo, DB, CI, Docker |
| Epic 01 Authentication (M1–M4) | ✅ Complete | Users collection, auth guards, SDK auth client |
| Architecture 1.1 | Frozen | No redesign |

**Blocked by:** Nothing — ready to start.

**Blocks:** Epic 03 Workspaces (workspace owner references User), Epic 21 Settings (profile section), avatar storage integration (Epic 14).

---

# Scope

## In scope

### Data model extensions (`users` collection)

Align with `08-database-design.md` where practical:

| Field / concern | Epic 02 action |
|-----------------|----------------|
| `avatar` (URL or storage key reference) | Add |
| `preferences` (embedded UI/settings object) | Add |
| `isDeleted`, `deletedAt` | Add (soft delete for `DELETE /users/me`) |
| Audit fields (`createdBy`, `updatedBy`, `version`) | Add or document phased adoption |
| Existing auth fields | Retain from Epic 01 — no breaking changes |

### Backend APIs (`/api/v1/users/*`)

Per `09-api-design.md`:

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/users/me` | Full profile (auth identity + preferences + avatar) |
| `PATCH` | `/users/me` | Update name, preferences |
| `DELETE` | `/users/me` | Soft-delete account, revoke sessions, bump token version |
| `PATCH` | `/users/me/avatar` | Upload / replace avatar metadata |

**Auth:** All routes require `JwtAuthGuard`. No `@Public()`.

**Relationship to `/auth/me`:**

- `GET /auth/me` — minimal identity for auth context (Epic 01, unchanged)
- `GET /users/me` — canonical profile read for UI settings and avatar

### Services & modules

- `UsersModule` expansion or `UserProfileModule` under `server/src/modules/users/`
- `UserProfileService` — orchestration, validation, soft delete
- Repository methods for profile update, soft delete, avatar key
- DTOs + Swagger for all user endpoints
- API tests (Supertest) + repository integration tests

### Frontend (profile UX)

- Profile page (settings shell — not full Epic 21 Settings)
- Edit display name
- Preferences form (theme, locale, notification toggles — minimal first slice)
- Avatar upload UI (client) wired to API; **storage upload port** may stub until Epic 14
- Account deletion confirmation flow
- SDK: `UsersApi` in `@project-genesis/sdk`
- Types: `UserProfile`, `UserPreferences`, `UpdateProfileInput`

### Shared packages

- `@project-genesis/types` — profile types separate from `SafeAuthUser`
- `@project-genesis/sdk` — `users` namespace

---

# Out of Scope

- Workspace creation, membership, or `workspaces` collection (Epic 03)
- Project or creative domain entities
- OAuth / social login / MFA
- Admin user management (Epic 19)
- Billing or subscription profile fields (Epic 20)
- Full Settings module (Epic 21) — Epic 02 delivers profile primitives only
- AI settings, storage quota UI, workspace settings
- Email change with verification (defer — requires mail adapter from Epic 01 M5)
- Password change via profile (remains under `/auth/*` or future auth hardening)

---

# Milestones

| ID | Name | Deliverables | Acceptance criteria |
|----|------|--------------|---------------------|
| M0 | Epic planning | This document | Architecture review ack |
| M1 | Profile persistence | Schema migration, repository methods, indexes | Integration tests; soft-delete works; preferences round-trip |
| M2 | Users HTTP API | Controller, service, DTOs, Swagger, guards | All `/users/*` endpoints; envelope + error codes; API tests |
| M3 | SDK + types | `UsersApi`, profile types | Typecheck; unit tests for client parsing |
| M4 | Profile frontend | Profile page, edit forms, avatar UI, delete account | Uses SDK only; matches design language; protected routes |
| M5 | Epic review | `review.md`, test coverage gap closure | Lint, build, tests green; no scope violations |

---

# Suggested implementation order

```text
M1 Profile schema + repository
        ↓
M2 Users HTTP API + tests
        ↓
M3 SDK / types (can parallelize late M2)
        ↓
M4 Profile UI
        ↓
M5 Epic review + E2E smoke (profile read/update)
```

---

# Technical guardrails

1. **Do not break Epic 01 auth flows** — register/login/refresh/logout unchanged.
2. **Keep profile logic in services** — repositories stay persistence-only.
3. **Soft delete** — `DELETE /users/me` sets `isDeleted` + `deletedAt`; auth guard rejects deleted users.
4. **Avatar** — store metadata in Mongo; binary upload via storage port (stub OK until Epic 14).
5. **Preferences** — embed small JSON object; validate with Zod/class-validator; no unbounded blobs.
6. **Frontend** — no direct `fetch` to Nest; use SDK; same-origin proxy pattern from M4.
7. **No workspace fields** on user documents.

---

# API contract sketch

### `GET /users/me`

Returns:

```json
{
  "id": "...",
  "email": "...",
  "name": "...",
  "role": "user",
  "status": "active",
  "avatarUrl": null,
  "preferences": { "theme": "system", "locale": "en" },
  "createdAt": "...",
  "updatedAt": "..."
}
```

### `PATCH /users/me`

Body (partial): `name`, `preferences`

### `DELETE /users/me`

Soft-deletes user, revokes all sessions, bumps `tokenVersion`.

### `PATCH /users/me/avatar`

Multipart or JSON with storage key from upload flow (TBD with Epic 14).

---

# Testing plan

| Layer | Tests |
|-------|-------|
| Repository | Profile update, soft delete, preferences merge |
| Service | Validation, delete side effects (sessions revoked) |
| API | CRUD profile, 401 without token, deleted user cannot auth |
| SDK | Response parsing, error mapping |
| Web | Form validation, profile render, delete confirmation |
| E2E (M5) | Login → view profile → update name → logout |

---

# Risks

| Risk | Mitigation |
|------|------------|
| `/auth/me` vs `/users/me` confusion | Document split; auth context keeps using `/auth/me` |
| Avatar without storage epic | Stub port; URL field only until Epic 14 |
| Schema migration on live `users` | Epic 02 is greenfield; add fields with defaults |
| Scope creep into Settings epic | Strict milestone checklist; preferences minimal |

---

# Checklist

- [ ] M0 Planning approved
- [ ] M1 Profile persistence
- [ ] M2 Users HTTP API
- [ ] M3 SDK + types
- [ ] M4 Profile frontend
- [ ] M5 Epic review

---

# References

- `docs/00-architecture/08-database-design.md` — `users` collection
- `docs/00-architecture/09-api-design.md` — User APIs
- `docs/00-architecture/12-security-design.md` — profile data protection
- `docs/00-architecture/25-frontend-api-client-spec.md` — client patterns
- `docs/01-epics/01-authentication/review.md` — Epic 01 handoff
