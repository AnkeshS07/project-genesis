# Epic 01 — Authentication — Architecture Review

> Status: **Complete — Epic 01 closed (M1–M4)**

Architecture Version: **1.1 (Frozen)**

---

# Review Purpose

Confirm that Epic 01 Authentication (M1–M4) matches Architecture 1.1, delivers the identity-only auth scope, and is ready for Epic 02 — Users.

M5 (Security Hardening) and M6 (Testing & Epic Review) remain **deferred follow-ups** within Epic 01’s original roadmap but are **not blockers** for closing M1–M4 delivery.

---

# Documents Reviewed

- [x] `docs/00-architecture/09-api-design.md` (auth endpoints)
- [x] `docs/00-architecture/12-security-design.md`
- [x] `docs/00-architecture/17-repository-spec.md`
- [x] `docs/00-architecture/19-api-controller-spec.md`
- [x] `docs/00-architecture/25-frontend-api-client-spec.md`
- [x] `docs/01-epics/01-authentication/README.md`
- [x] Product Design Specification (auth screens — canvas artifact)

---

# Milestone Verification

## M1 — User + Session Persistence ✅

| Requirement | Evidence | Pass |
|-------------|----------|------|
| User Mongo schema (identity fields) | `server/src/users/user.schema.ts` | ✅ |
| Session Mongo schema (hashed refresh tokens) | `server/src/sessions/session.schema.ts` | ✅ |
| Repository pattern + DI tokens | `server/src/repositories/`, `user.repository.ts`, `session.repository.ts` | ✅ |
| Index sync on startup | `user-index-sync.service.ts`, `session-index-sync.service.ts` | ✅ |
| Integration tests (Mongo) | `server/test/integration/user-session.repository.spec.ts` | ✅ |
| No workspace/profile fields | Schema + `user-session.schema.spec.ts` | ✅ |

## M2 — Password & Token Core ✅

| Requirement | Evidence | Pass |
|-------------|----------|------|
| Argon2id password hashing | `server/src/auth/password.service.ts` | ✅ |
| JWT access tokens (minimal claims) | `server/src/auth/token.service.ts` | ✅ |
| Opaque refresh tokens + SHA-256 at rest | `server/src/auth/session.service.ts` | ✅ |
| Refresh rotation + reuse detection | `session.service.ts` + unit tests | ✅ |
| Max sessions + FIFO eviction | `session.service.ts` | ✅ |
| No HTTP/cookie coupling in core | `server/src/auth/` has no Express imports | ✅ |
| Unit tests | `server/test/unit/auth/*.spec.ts` | ✅ |

## M3 — Authentication HTTP API ✅

| Requirement | Evidence | Pass |
|-------------|----------|------|
| `POST register/login/refresh/logout/logout-all` | `server/src/modules/auth/auth.controller.ts` | ✅ |
| `POST forgot-password/reset-password`, `GET me` | Same controller | ✅ |
| DTO validation + Swagger | `dto/*.ts`, `server/src/main.ts` | ✅ |
| HttpOnly refresh cookie (`path=/api/v1/auth`) | `auth-cookie.service.ts` | ✅ |
| Global `JwtAuthGuard` + `@Public()` + `@CurrentUser()` | `auth-http.module.ts`, guards, decorators | ✅ |
| Password reset persistence | `server/src/password-resets/` | ✅ |
| `AuthMailPort` noop adapter | `ports/auth-mail.port.ts`, `noop-auth-mail.adapter.ts` | ✅ |
| API envelope + error codes | `response-envelope.interceptor.ts`, `global-exception.filter.ts` | ✅ |
| API tests | `server/test/api/auth.api.spec.ts` (19 cases) | ✅ |

**Fix applied during review:** `logout-all` now calls `bumpTokenVersion` so access tokens are immediately invalidated (`auth.service.ts`).

## M4 — Frontend Authentication ✅

| Requirement | Evidence | Pass |
|-------------|----------|------|
| Login / Register / Forgot / Reset pages | `apps/web/app/(auth)/*/page.tsx` | ✅ |
| Centered auth card design language | `components/auth/*`, ink/paper/accent theme | ✅ |
| `AuthProvider` + session restore | `features/auth/auth-provider.tsx` (`refresh` → `me`) | ✅ |
| Protected route (`/account`) | `app/(protected)/account/page.tsx` + `RequireAuth` | ✅ |
| Public route guards | `PublicOnly` on auth pages | ✅ |
| Logout + refresh flow | `AuthProvider`, SDK `HttpClient` 401 retry | ✅ |
| SDK `AuthApi` + types | `packages/sdk/src/auth/auth-api.ts`, `packages/types/src/index.ts` | ✅ |
| Same-origin API proxy | `apps/web/next.config.ts` rewrites | ✅ |
| No dashboard/workspace/projects UI | Route audit | ✅ |

**Fix applied during review:** Removed broken middleware cookie gate. Refresh cookie path `/api/v1/auth` is not visible on page routes; protection is client-side via `RequireAuth` / `PublicOnly`. Middleware is a documented no-op placeholder.

---

# Architecture Compliance

| Area | Expected | Pass | Notes |
|------|----------|------|-------|
| Layering | Controllers → services → repositories | ✅ | Auth core separated from HTTP module |
| Next.js UI-only | No business Route Handlers | ✅ | Proxy rewrites only |
| SDK as HTTP boundary | Frontend uses `@project-genesis/sdk` | ✅ | |
| Identity-only user model | No workspace/membership in Epic 01 | ✅ | |
| Refresh cookie security | HttpOnly, path-scoped, rotation | ✅ | |
| Access token in memory (browser) | Not in localStorage | ✅ | `ApiClient` in-memory token |
| JWT minimal claims | sub, role, tokenVersion, jti | ✅ | No email/workspace in JWT |
| Password never in responses | API tests assert | ✅ | |

---

# Scope Violations

**None found** for Epic 01 boundaries:

- No workspace, project, dashboard, billing, or AI workspace implementation
- No Epic 02 profile APIs (`PATCH /users/me`, avatar, account deletion)
- Minimal `/account` page is an auth verification surface, not a dashboard
- Minimal marketing home shell is acceptable bootstrap navigation, not a full landing page

---

# Findings

## Blockers (resolved during review)

| Issue | Resolution |
|-------|------------|
| Middleware read `refresh_token` on page routes, but cookie path is `/api/v1/auth` | Client-side guards only; middleware is no-op with documentation |
| `logout-all` did not bump `tokenVersion` | Fixed in `auth.service.ts`; API test added |

## Non-blocking / deferred (M5–M6)

| Item | Target |
|------|--------|
| Rate limiting on auth endpoints | M5 |
| Audit logging (login/logout/reset) | M5 |
| CSRF strategy for cookie-based refresh | M5 |
| CORS / Helmet / security headers | M5 |
| Real email adapter (`AuthMailPort`) | M5 |
| Common DB audit/soft-delete fields on `users` | Align with `08-database-design.md` in Epic 02+ |
| Account lockout on failed login (`lockUntil`) | M5 or Epic 02 |
| Mongo integration tests for `password_resets` | M6 |
| Playwright auth E2E | M6 |
| Reset-password missing-token UX | M6 |
| Explicit JWT `algorithm: 'HS256'` in JwtModule | M5 |
| `password-reset.repository` ObjectId consistency | M6 |

## Intentional architecture notes

- Refresh sessions stored in Mongo (architecture diagram mentions Redis for sessions — acceptable Epic 01 deviation; refresh tokens are opaque DB records, not Redis sessions)
- `GET /auth/me` used for identity; `GET /users/me` deferred to Epic 02 per epic out-of-scope list
- `RolesGuard` skeleton only — admin enforcement deferred

---

# Verification Evidence

| Check | Result |
|-------|--------|
| ESLint | ✅ Pass |
| Server unit tests | ✅ 46/46 |
| Server API tests | ✅ 19/19 |
| Web unit tests | ✅ 5/5 |
| Web production build | ✅ Pass (after middleware fix) |
| Typecheck (types, sdk, web, server) | ✅ Pass |

---

# Decision

- [x] **Approved** — Epic 01 M1–M4 complete; proceed to Epic 02 — Users
- [ ] **Approved with follow-ups**
- [ ] **Rejected**

Reviewer: Lead Software Engineer (Epic 01 audit)

Date: 2026-07-27

Notes: M5–M6 remain open as hardening and epic-level test coverage work. Do not redesign Architecture 1.1.

---

# Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Architecture | — | 2026-07-27 | Pending product/architecture lead ack |
| Engineering | Lead Software Engineer | 2026-07-27 | M1–M4 audit complete |
