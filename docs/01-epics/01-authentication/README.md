# Epic 01 — Authentication

> Status: **Complete — Epic 01 closed (M1–M4)**

Architecture Version: **1.1 (Frozen)**

---

# Objective

Establish secure identity: register, login, refresh, logout, password recovery, and `GET /auth/me`.

**Identity only** — no workspaces, memberships, or business aggregates.

---

# Scope

- User + session persistence (M1) ✅
- Password hashing + token core (M2) ✅
- Auth HTTP API + guards (M3) ✅
- Frontend auth UX (M4) ✅
- Security hardening via ports (M5) — deferred
- Testing & epic review (M6) — deferred

---

# Out of Scope

- Workspace creation / membership / ownership
- OAuth / MFA
- Concrete email or Redis rate-limit adapters (ports only until approved)
- Domain resources (projects, etc.)
- Full Users profile APIs (Epic 02)

---

# Milestones

| ID | Name | Status |
|----|------|--------|
| M0 | Architecture Freeze | ✅ |
| M1 | User + Session Persistence | ✅ |
| M2 | Password & Token Core | ✅ |
| M3 | Authentication API | ✅ |
| M4 | Frontend Authentication | ✅ |
| M5 | Security Hardening | ⬜ deferred |
| M6 | Testing & Epic Review | ⬜ deferred |

See [review.md](./review.md) for audit evidence and M5–M6 backlog.

---

# M4 notes

- Auth pages: `/login`, `/register`, `/forgot-password`, `/reset-password`
- `AuthProvider` with session restore (`refresh` + `me`), protected `/account` route via client guards (`RequireAuth` / `PublicOnly`)
- `@project-genesis/sdk` HTTP client + `AuthApi`; browser calls proxied via Next rewrites (`/api/v1/*`)
- Access token in memory; refresh token HttpOnly cookie (same-origin via proxy)
- Middleware is a no-op placeholder — refresh cookie path prevents server-side page-route gating

---

# M3 notes

- `POST/GET /api/v1/auth/*` — register, login, refresh, logout, logout-all, forgot/reset password, me
- `JwtAuthGuard` + `@Public()` + `@CurrentUser()`; `RolesGuard` skeleton only
- Refresh token via HttpOnly cookie (`path=/api/v1/auth`); access token Bearer only
- `AuthMailPort` noop adapter; password reset tokens in `password_resets` collection
- `logout-all` bumps `tokenVersion` to invalidate access tokens immediately
- Health/docs remain unversioned at root

---

# Checklist

- [x] M1 persistence layer
- [x] M2 password & token core
- [x] M3 authentication API
- [x] M4 frontend authentication
- [ ] M5 security hardening (deferred)
- [ ] M6 epic-level test review (deferred)
