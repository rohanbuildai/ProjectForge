# 🗺️ ProjectForge — Development Roadmap

> A production-oriented project management & team collaboration platform.
> Node.js + Express.js + PostgreSQL backend, React + Vite frontend.

---

## 🎯 What Is Being Built

ProjectForge is a **team collaboration and project-management platform** (in the spirit of Asana / Trello / Linear / Notion-project mode). It is being built with real-world backend engineering principles, not tutorial CRUD.

The intended end software:

- **Multi-tenant workspaces** (organizational boundaries) where teams cooperate.
- **Workspace membership + Role-Based Access Control** (Owner / Admin / Member).
- **Secure invitation lifecycle** so users join workspaces by token.
- **Projects & Tasks** scoped to a workspace, with assignment, priority, status, due dates, search, filtering, sorting, and pagination.
- **Per-workspace dashboard** with real-time statistics and recent activity.
- **Collaboration layers**: task comments, file attachments (R2 object storage), activity logs.
- **Notification system** (tasks, comments, invites, member-adds).
- **Future**: real-time collaboration (WebSockets), advanced PM features, and AI-powered assistance.

Long-term architecture:

```text
Workspace
├── Members
├── Invitations
├── Projects
│   ├── Tasks
│   │   ├── Comments
│   │   ├── Attachments
│   │   └── Activity
├── Dashboard
├── Notifications
└── Real-time Collaboration / AI
```

---

## ✅ What Is DONE (Implemented)

### Backend — Authentication & Security
- [x] User registration (bcrypt password hashing, email normalization, duplicate check)
- [x] User login
- [x] JWT access tokens (HTTP-only cookie)
- [x] Refresh tokens with rotation + SHA-256 hashing + revocation on logout
- [x] `/auth/me` current-user endpoint
- [x] Protected-route middleware that verifies JWT cookie

### Backend — Workspaces & Members
- [x] Workspace CRUD (create, list, get, update, delete — owner-gated)
- [x] Workspace membership (join / list / role update / remove)
- [x] RBAC roles: `OWNER`, `ADMIN`, `MEMBER`
- [x] Owner-only guard on sensitive operations
- [x] `validateCreateWorkspace` input validation middleware

### Backend — Workspace Invitations
- [x] Invitation creation (owner-only, secure random token → SHA-256 hash persisted, 7-day expiry)
- [x] Invitation accept (email must match, PENDING + expiry checks)
- [x] Invitation list (pending, member-gated)
- [x] Invitation reject
- [x] Invitation revoke (owner-only)
- [x] Duplicate pending invitation prevention

### Backend — Projects
- [x] Project CRUD (create / list / get / update / delete)
- [x] Project search (`ILIKE` on title/description)
- [x] Workspace-scoped access verification

### Backend — Tasks
- [x] Task CRUD (create / get / update / delete)
- [x] Task assignment to workspace members
- [x] Task search, filtering (status / priority), sorting (whitelisted fields), pagination
- [x] Assigned-task notifications (status change, assignment, deletion)

### Backend — Dashboard
- [x] Workspace dashboard — totals, completed/in-progress/todo counts, high-priority, overdue, completion %, recent projects & tasks

### Backend — Collaboration (Phase 7)
- [x] Task comment creation
- [x] Task comment listing (with author name/email)
- [x] Task comment update (owner-only)
- [x] Task comment deletion (owner-only)
- [x] Notifications on new comment (to task assignee)
- [x] Notifications service — create / list / unread count / mark-read / mark-all-read / delete
- [x] Activity log creation (service + controller + route present)

### Frontend (early / partial)
- [x] Vite + React scaffold, routing (`/`, `/register`, `/dashboard`, 404)
- [x] Login page (functional)
- [x] Register page (functional)
- [x] Protected route wrapper (auth check)
- [x] Dashboard shell + nav bar
- [x] Project create/edit modal + project card list + delete
- [x] Axios client with credentials

---

## 🚧 In Progress / Partially Done

- [ ] **Activity logs** — only `create` exists; no listing/querying of a workspace/task's activity, not yet wired into task/comment/project actions.
- [ ] **File attachments** — model + service + routes exist, but the service is **broken** (`taskAttachments.service.js`) and the tables are not in `schema.sql`. See issues below.
- [ ] **Centralized error handling** — controllers call `next(error)` but `app.js` has **no global error-handler middleware**, so thrown errors are not serialized consistently.

### Frontend parity (backend is ahead of frontend)
- [ ] Workspace UI (create/list/select workspace, workspace switcher)
- [ ] Members & roles UI
- [ ] Invitations UI
- [ ] Task UI (list/filter/sort/create/edit/delete, assignment)
- [ ] Dashboard wiring (currently hard-coded zeros)
- [ ] Comments UI
- [ ] Notifications UI (bell in navbar does nothing yet)
- [ ] Attachments UI

---

## ❌ Known Bugs / Broken Pieces (found during codebase inspection)

| File | Problem |
|---|---|
| `backend/src/services/taskAttachments.service.js` | Uses `crypto.randomUUID()` and `r2StorageService.*` but **neither `crypto` nor `r2StorageService` is imported** → runtime crash. |
| `backend/src/app.js` | No **global error handler**; `next(error)` from comments/notifications/attachments controllers hits Express's default HTML error page instead of a JSON `{success:false}` response. |
| `database/schema.sql` | **Stale / incomplete** — only defines `users`, `projects`, `tasks`, `refresh_tokens`, `workspaces`, `workspace_members`. Missing `workspace_invitations`, `task_comments`, `task_attachments`, `notifications`, `activity_logs` (models reference these). `projects` also lacks `workspace_id`. |
| `frontend/src/pages/Dashboard.jsx` | Uses `window.confirm(...)` (no such function) on project delete. |
| `frontend/src/pages/Register.jsx` | Imports `useLocation` (does not exist in `react-router-dom`); success message is never displayed because Login does not read it. |
| Frontend API wiring | Dashboard calls `GET /projects` but backend exposes `GET /:workspaceId/projects` → projects won't load until wiring (and workspace selection) is added. |
| `backend/src/controllers/invitationController.js` | `revoke` uses `POST` route (`POST /:invitationId/revoke`); minor semantic inconsistency. |

---

## 🔍 Security / Architectural Strengths to Preserve
- Password hashing (bcrypt) — never plaintext.
- JWT in HTTP-only, `SameSite=Strict` cookies; `secure` flag honors `NODE_ENV`.
- Refresh-token rotation + hashing in DB.
- Parameterized SQL everywhere (no direct interpolation of user input).
- Invitation tokens: `crypto.randomBytes(32)` + SHA-256 hash; only hash is stored.
- Server-side authorization never trusts client-sent role.
- Workspace/project/task scoping checks in services.
- Tasks: whitelisted sort fields prevent SQL injection via `ORDER BY`.

---

## 🔜 Upcoming / Planned (per README & docs)
- [ ] Real-time collaboration (WebSockets / SSE)
- [ ] Full notification delivery (email/push/realtime — currently DB-level only)
- [ ] Advanced project management (boards, milestones, subtasks, assignee sets)
- [ ] AI-backed features (summaries, natural-language project interaction, intelligence)
- [ ] Production hardening
  - [ ] `helmet`, rate limiting, centralized JSON error handler
  - [ ] Structured logging (e.g. `pino`/`winston`) + request IDs
  - [ ] Automated tests (unit/integration) — currently Postman-only
  - [ ] Monitoring & observability
  - [ ] Caching & background jobs
  - [ ] Deployment automation & horizontal scaling
- [ ] Email verification, password reset, MFA, account lockout (from `SECURITY.md`)

---

## 📋 Suggested Implementation Order (priority)

1. **Fix the blockers** — global error handler; `taskAttachments.service.js` imports; complete `schema.sql` to match all models.
2. **Finish activity logs** — query-by-task API + wire into task/project/comment actions.
3. **Finish attachments** — get DB table, add download/authorized-file routes, size/type limits.
4. **Frontend workspaces** — workspace CRUD + workspace switcher, then members, invitations, tasks.
5. **Notifications + real-time** — realtime delivery, then the notifications UI.
6. **Full frontend parity** — comments, attachments, dashboard wiring.
7. **Production hardening** — error handling, validation, rate limits, logging, tests, deploy.

---

## ✅ Definitions of Done (per feature)
Following the project's staged workflow:
``Design → Understand → DB/Model → Service → Controller → Route → Test → Production Review → Commit & Push``

A feature is **done** only when it is implemented across all layers **and** tested for happy path + failure/edge cases (Postman), reviewed, and committed with a meaningful message.

---

*Generated from a full codebase inspection (2026-08-24). Re-run this analysis to refresh.*