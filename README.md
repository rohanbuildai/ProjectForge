# 🚀 ProjectForge

> A production-oriented project management and team collaboration backend built with Node.js, Express.js, and PostgreSQL.

ProjectForge is a long-term backend engineering project focused on building the backend of a modern project management and team collaboration platform.

The goal is not simply to create CRUD APIs. ProjectForge is being designed and implemented with real-world backend engineering principles including authentication, authorization, role-based access control, relational database design, secure workflows, database constraints, pagination, filtering, search, modular architecture, and production-oriented development practices.

---

## 📌 Current Status

ProjectForge is actively under development.

### Completed

- ✅ Authentication
- ✅ JWT-based authorization
- ✅ HTTP-only cookie authentication
- ✅ Workspace management
- ✅ Workspace membership
- ✅ Role-based workspace authorization
- ✅ Project management
- ✅ Task management
- ✅ Task assignment
- ✅ Task search
- ✅ Task filtering
- ✅ Task sorting
- ✅ Task pagination
- ✅ Workspace dashboard
- ✅ Complete workspace invitation lifecycle
- ✅ Task comment creation

### Currently in Development

- 🚧 Task comment listing
- 🚧 Task comment updating
- 🚧 Task comment deletion
- 🚧 Activity logging
- 🚧 File attachments

### Planned

- ⏳ Real-time collaboration
- ⏳ Notifications
- ⏳ Advanced project management
- ⏳ AI-powered backend features
- ⏳ Production hardening
- ⏳ Deployment and scaling

---

# 🎯 Project Vision

ProjectForge is being built as a complete collaboration platform where users can organize their work inside isolated workspaces.

The long-term architecture looks conceptually like this:

```text
Workspace
│
├── Members
├── Invitations
│
├── Projects
│   │
│   ├── Tasks
│   │   ├── Comments
│   │   └── Attachments
│   │
│   └── Activity
│
├── Dashboard
├── Notifications
└── Real-time Collaboration
```

The system is intentionally being developed incrementally.

Every feature follows:

```text
Design
   ↓
Understand important concepts
   ↓
Database / Model
   ↓
Service
   ↓
Controller
   ↓
Route
   ↓
Testing
   ↓
Production Review
   ↓
Commit & Push
```

---

# 🏗️ Architecture

ProjectForge follows a layered backend architecture.

```text
Client
  │
  ▼
Routes
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
Models
  │
  ▼
PostgreSQL
```

### Routes
Define API endpoints and connect requests to middleware/controllers. Routes remain lightweight and contain no business logic.

### Controllers
Handle HTTP concerns: parameters, request bodies, authenticated user data, service calls, and responses.

### Services
Contain business logic such as workspace membership checks, role checks, invitation workflows, authorization rules, and coordination between models.

### Models
Contain SQL queries and database operations. Models do not contain application-level authorization logic.

---

# 🛠️ Tech Stack

## Backend
- Node.js
- Express.js
- JavaScript
- CommonJS modules

## Database
- PostgreSQL

## Authentication & Security
- JWT
- HTTP-only cookies
- bcrypt
- SHA-256
- Node.js `crypto`

## API Testing
- Postman

## Database Management
- PostgreSQL
- pgAdmin

## Version Control
- Git
- GitHub

---

# 📂 Project Structure

```text
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── workspaceController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── dashboardController.js
│   │   └── workspaceInvitationController.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── workspace.model.js
│   │   ├── workspaceMember.model.js
│   │   ├── project.model.js
│   │   ├── task.model.js
│   │   ├── dashboard.model.js
│   │   └── workspaceInvitation.model.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── workspace.service.js
│   │   ├── project.service.js
│   │   ├── task.service.js
│   │   ├── dashboard.service.js
│   │   └── workspaceInvitation.service.js
│   │
│   ├── middleware/
│   │   └── ...
│   │
│   ├── routes/
│   │   └── ...
│   │
│   └── app.js
│
├── package.json
├── .gitignore
└── README.md
```

The structure will continue evolving as ProjectForge grows.

---

# 🔐 Authentication

ProjectForge uses JWT-based authentication with secure password handling.

## Registration

```text
User submits credentials
        │
        ▼
Input validation
        │
        ▼
Normalize email
        │
        ▼
Check duplicate email
        │
        ▼
Hash password using bcrypt
        │
        ▼
Create user
        │
        ▼
Return user information
```

Passwords are never stored as plaintext.

## Login

```text
Credentials
    │
    ▼
Find user
    │
    ▼
Verify password
    │
    ▼
Generate JWT
    │
    ▼
Store authentication token
in HTTP-only cookie
    │
    ▼
Authenticated requests
```

---

# 🏢 Workspace System

A workspace is the primary organizational boundary in ProjectForge.

```text
Workspace
│
├── Members
├── Projects
├── Tasks
├── Invitations
└── Dashboard
```

Users can belong to multiple workspaces. Workspace membership is represented separately from users so that roles and access can be managed per workspace.

---

# 👥 Workspace Membership & Authorization

Workspace-level authorization is handled through the workspace membership system.

```text
Authenticated User
        │
        ▼
Workspace Membership
        │
        ▼
Role
        │
        ▼
Permission
```

The application does not trust role information supplied by the client. Actual membership and role information is retrieved from PostgreSQL.

Sensitive workspace operations currently use the `OWNER` role.

---

# 📁 Projects

Projects belong to workspaces.

```text
Workspace
    │
    └── Projects
```

Projects provide higher-level organization for tasks and remain workspace-scoped.

---

# ✅ Task Management

Tasks belong to projects.

```text
Workspace
    │
    ▼
Project
    │
    ▼
Task
```

Tasks currently support:

- Title
- Description
- Status
- Priority
- Due date
- Assignee
- Creation information

Tasks can be created, retrieved, updated, and deleted.

---

# 👤 Task Assignment

Tasks can be assigned to users.

Task retrieval can include:

- Assignee ID
- Assignee name
- Assignee email

---

# 🔎 Task Search, Filtering, Sorting & Pagination

ProjectForge supports task discovery through:

- Search by title
- Filtering by status
- Filtering by priority
- Sorting by supported fields
- Pagination

Pagination uses:

```text
LIMIT
OFFSET
```

The API returns:

```text
tasks
totalTasks
```

This allows clients to construct pagination interfaces.

---

# 📊 Workspace Dashboard

The workspace dashboard provides an overview of projects and tasks.

It includes statistics such as:

- Total projects
- Total tasks
- Completed tasks
- In-progress tasks
- Todo tasks
- High-priority tasks
- Overdue tasks
- Completion percentage

It can also provide recent projects and tasks.

Dashboard access is workspace-scoped.

---

# ✉️ Workspace Invitation System

ProjectForge contains a complete workspace invitation lifecycle.

```text
                  ┌──────────┐
                  │ PENDING  │
                  └────┬─────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      ACCEPTED      REJECTED      REVOKED
```

Supported operations:

- Create invitation
- Accept invitation
- List invitations
- Reject invitation
- Revoke invitation

---

# 🔒 Secure Invitation Tokens

Invitation tokens are generated using cryptographically secure random bytes.

```text
Random Token
     │
     ▼
SHA-256
     │
     ▼
Token Hash
     │
     ▼
PostgreSQL
```

The raw token is used by the invited user, while only its SHA-256 hash is persisted in the database.

---

# ⏳ Invitation Expiration

Invitations contain an expiration timestamp.

The current implementation uses a seven-day expiration period.

Before processing an invitation:

```text
Current Time < expires_at
```

must be true.

Expired invitations cannot be processed.

---

# 🚫 Duplicate Pending Invitations

ProjectForge prevents multiple pending invitations for the same email address inside the same workspace.

Application logic and database constraints work together to enforce this rule.

Historical invitations remain after their status changes.

Example:

```text
Workspace
│
├── john@example.com → ACCEPTED
├── john@example.com → REJECTED
├── john@example.com → REVOKED
└── john@example.com → PENDING
```

Two simultaneous `PENDING` invitations for the same workspace/email are not allowed.

---

# 📩 Create Invitation

```http
POST /api/v1/workspaces/:workspaceId/invitations
```

Flow:

```text
Request
  │
  ▼
Validate workspace
  │
  ▼
Verify requester is OWNER
  │
  ▼
Normalize email
  │
  ▼
Check existing membership
  │
  ▼
Check pending invitation
  │
  ▼
Generate secure token
  │
  ▼
Hash token
  │
  ▼
Set expiration
  │
  ▼
Create invitation
  │
  ▼
Return invitation
```

---

# ✅ Accept Invitation

```http
POST /api/v1/invitations/:token/accept
```

Flow:

```text
Token
  │
  ▼
SHA-256 hash
  │
  ▼
Find invitation
  │
  ▼
Verify invitation exists
  │
  ▼
Verify PENDING status
  │
  ▼
Verify expiration
  │
  ▼
Verify authenticated email
  │
  ▼
Create workspace membership
  │
  ▼
Mark invitation ACCEPTED
```

The authenticated user's email must match the invitation email.

---

# 📋 List Invitations

```http
GET /api/v1/workspaces/:workspaceId/invitations
```

The endpoint verifies that the requester belongs to the workspace before returning invitations.

Invitation data can include:

- Invitation ID
- Email
- Role
- Status
- Expiration
- Inviter
- Creation timestamp

---

# ❌ Reject Invitation

```http
POST /api/v1/invitations/:token/reject
```

Flow:

```text
Token
  │
  ▼
SHA-256 hash
  │
  ▼
Find invitation
  │
  ▼
Verify PENDING
  │
  ▼
Verify expiration
  │
  ▼
Verify invited email
  │
  ▼
Status → REJECTED
```

Rejecting an invitation does not create workspace membership.

---

# 🚫 Revoke Invitation

```http
PATCH /api/v1/invitations/:invitationId/revoke
```

Revocation is an owner-side operation.

```text
Invitation ID
      │
      ▼
Find invitation
      │
      ▼
Get workspace ID
      │
      ▼
Verify requester is OWNER
      │
      ▼
Verify invitation is PENDING
      │
      ▼
Status → REVOKED
```

A revoked invitation cannot be accepted.

---

# 💬 Phase 7 — Collaboration

Phase 7 introduces collaboration features.

The first collaboration feature is Task Comments.

The intended collaboration architecture is:

```text
Task
│
├── Comments
├── Attachments
└── Activity History
```

---

# 💬 Task Comments

A comment belongs to a task and a user.

```text
User
  │
  ▼
Comment
  │
  ▼
Task
  │
  ▼
Project
  │
  ▼
Workspace
```

## Database Schema

The `task_comments` table contains:

```text
task_comments
│
├── id
├── task_id
├── user_id
├── content
├── created_at
└── updated_at
```

### Task Relationship

```text
task_comments.task_id
        │
        ▼
tasks.id
```

Deleting a task cascades to its comments.

### User Relationship

```text
task_comments.user_id
        │
        ▼
users.id
```

The current relationship prevents deleting a referenced user while comments still depend on that user.

### Content Constraint

The database rejects empty or whitespace-only content:

```sql
CHECK (length(trim(content)) > 0)
```

### Index

An index exists on:

```text
task_comments.task_id
```

to optimize retrieval of comments for a task.

---

# ➕ Create Comment

```http
POST /api/v1/tasks/:taskId/comments
```

Example request body:

```json
{
  "content": "I'll finish this task by tomorrow."
}
```

The user ID comes from the authenticated user and is never trusted from the request body.

Flow:

```text
POST /tasks/:taskId/comments
              │
              ▼
        Get authenticated user
              │
              ▼
           Get task
              │
              ▼
        Does task exist?
              │
              ▼
      Get task's workspace
              │
              ▼
   Check workspace membership
              │
        ┌─────┴─────┐
        │           │
       NO          YES
        │           │
      Reject        ▼
              Create comment
                    │
                    ▼
             Return comment
```

Any authenticated member of the workspace can comment. Commenting is not restricted to the workspace owner.

---

# 🗃️ Database Design Philosophy

PostgreSQL is treated as an important part of the application's integrity layer.

## Foreign Keys

Relationships are enforced at the database level.

Examples:

```text
Task → Project
Project → Workspace
Comment → Task
Comment → User
Invitation → Workspace
Invitation → User
```

## Parameterized Queries

Queries use parameters:

```sql
WHERE id = $1
```

rather than directly interpolating user-controlled values.

## Constraints

The database uses:

- Primary keys
- Foreign keys
- NOT NULL constraints
- CHECK constraints
- Unique constraints/indexes

## Indexing

Indexes are added for frequently queried relationships and constraints, such as:

```text
task_comments.task_id
```

---

# 🔐 Security Principles

Security is considered throughout development.

## Password Security

Passwords are hashed with bcrypt and are never stored in plaintext.

## Authentication

JWT-based authentication identifies authenticated users.

HTTP-only cookies are used where applicable.

## Authorization

Authentication determines identity.

Authorization determines whether the authenticated user can perform an operation.

## Workspace Isolation

Workspace-scoped resources are protected by membership checks.

## Role-Based Access Control

Sensitive operations require appropriate workspace roles, such as `OWNER`.

## Secure Tokens

Invitation tokens use cryptographically secure random generation and only their SHA-256 hashes are persisted.

---

# 🧪 Testing Strategy

Postman is currently used for API testing.

Every feature is tested after implementation.

Testing covers:

### Happy Paths

Successful creation, retrieval, update, acceptance, rejection, etc.

### Failure & Edge Cases

- Invalid authentication
- Unauthorized users
- Non-members
- Missing resources
- Duplicate invitations
- Expired invitations
- Already processed invitations
- Invalid invitation tokens
- Invalid workspace access
- Invalid comment content

A feature is not committed until it has been tested and reviewed.

---

# 🔄 Development Workflow

Every feature follows:

```text
1. Design
       ↓
2. Understand important new concepts
       ↓
3. Database / Model
       ↓
4. Service
       ↓
5. Controller
       ↓
6. Route
       ↓
7. Test
       ↓
8. Production Review
       ↓
9. Commit & Push
```

The project intentionally avoids blindly copying implementation code.

The purpose is to understand why each architectural and database decision is made.

---

# 🌿 Git Workflow

ProjectForge uses meaningful feature-level commits.

Examples:

```text
feat: implement workspace invitation creation system
feat: implement workspace invitation acceptance flow
feat: implement workspace invitation listing
feat: implement workspace invitation rejection flow
feat: implement workspace invitation revocation flow
feat: implement task comment creation
```

This keeps the Git history understandable and makes individual features easy to identify.

---

# 🗺️ Development Roadmap

```text
Phase 1
Foundation
   │
   ▼
Phase 2
Core Backend
   │
   ▼
Phase 3
Authentication & Authorization
   │
   ▼
Phase 4
Workspaces, Projects, Tasks & Dashboard
   │
   ▼
Phase 6
Workspace Invitation System
   │
   ▼
Phase 7
Collaboration
   │
   ├── Task Comments
   ├── Activity Logs
   └── File Attachments
   │
   ▼
Future Phases
   │
   ├── Real-time Collaboration
   ├── Notifications
   ├── Advanced Project Management
   ├── AI Backend
   └── Production Hardening
```

---

# 📈 Current Feature Matrix

| Feature | Status |
|---|---|
| User Registration | ✅ Complete |
| User Login | ✅ Complete |
| JWT Authentication | ✅ Complete |
| HTTP-only Authentication Cookies | ✅ Complete |
| Workspace Management | ✅ Complete |
| Workspace Membership | ✅ Complete |
| Workspace Roles | ✅ Complete |
| Project Management | ✅ Complete |
| Task Management | ✅ Complete |
| Task Assignment | ✅ Complete |
| Task Search | ✅ Complete |
| Task Filtering | ✅ Complete |
| Task Sorting | ✅ Complete |
| Task Pagination | ✅ Complete |
| Workspace Dashboard | ✅ Complete |
| Create Invitation | ✅ Complete |
| Accept Invitation | ✅ Complete |
| List Invitations | ✅ Complete |
| Reject Invitation | ✅ Complete |
| Revoke Invitation | ✅ Complete |
| Create Task Comment | ✅ Complete |
| List Task Comments | 🚧 In Progress |
| Update Task Comment | 🚧 In Progress |
| Delete Task Comment | 🚧 In Progress |
| Activity Logs | 🚧 In Progress |
| File Attachments | 🚧 In Progress |
| Real-time Collaboration | ⏳ Planned |
| Notifications | ⏳ Planned |
| AI Features | ⏳ Planned |
| Production Hardening | ⏳ Planned |

---

# ⚙️ Getting Started

## Prerequisites

Install:

- Node.js
- npm
- PostgreSQL
- Git

## Clone

```bash
git clone https://github.com/rohanbuildai/ProjectForge.git
cd ProjectForge
```

## Install Dependencies

```bash
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file according to the application's configuration.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=projectforge_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
```

Use strong secrets in real environments.

Never commit `.env` files or credentials to Git.

---

# ▶️ Running the Application

Start the development server using the configured development command:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

---

# 📡 API Versioning

ProjectForge uses versioned API routes.

Example:

```text
/api/v1/...
```

This provides a foundation for future API evolution without immediately breaking existing clients.

---

# 🧱 Production-Oriented Engineering

ProjectForge is intentionally built with production considerations from the beginning.

Key principles:

### Separation of Concerns
Routes, controllers, services, and models have distinct responsibilities.

### Database Integrity
Foreign keys and constraints protect relationships and important invariants.

### Secure Authentication
Passwords are hashed and authentication credentials are protected.

### Server-Side Authorization
Workspace membership and roles are verified on the server.

### Input Validation
Invalid input is rejected before reaching sensitive application logic.

### Parameterized SQL
User-controlled values are passed as SQL parameters.

### Pagination
Large collections are not returned blindly in one response.

### Search and Filtering
Task retrieval supports structured filtering and search.

### Meaningful Git History
Each meaningful feature receives its own commit.

---

# 🚧 Future Engineering Improvements

As ProjectForge grows, additional production improvements are planned, including:

- Centralized error handling refinements
- More comprehensive validation
- Automated tests
- API documentation
- Rate limiting
- Structured logging
- Monitoring
- Caching
- Background jobs
- Object storage
- WebSocket infrastructure
- Deployment automation
- Horizontal scaling

These will be introduced when they become relevant to the architecture rather than being added prematurely.

---

# 🔮 Future Vision

The long-term goal is to evolve ProjectForge into a complete project-management and collaboration platform.

```text
                    ProjectForge
                         │
              ┌──────────┴──────────┐
              │                     │
          Workspaces             Users
              │
       ┌──────┼─────────┐
       │      │         │
   Projects Members Invitations
       │
     Tasks
       │
 ┌─────┼──────────┐
 │     │          │
Comments Files   Activity
 │
 └───────────────┐
                 │
          Collaboration
                 │
       ┌─────────┼─────────┐
       │         │         │
    Realtime Notifications AI
```

The final system is intended to combine strong backend engineering with intelligent features.

---

# 🤖 Future AI Integration

AI integration is planned for a later phase.

The AI layer will eventually integrate with the existing backend rather than being an isolated demonstration.

Potential areas include:

- Project intelligence
- Task assistance
- Productivity insights
- Intelligent summaries
- Natural-language project interaction
- Automated project analysis

The exact AI feature set will be designed when the AI phase begins.

---

# 🤝 Contributing

ProjectForge is currently primarily developed as a long-term personal engineering project.

As the project matures, contribution guidelines, issue templates, and development documentation may be added.

Suggestions, discussions, and contributions are welcome as the project moves toward a more public development stage.

---

# 👨‍💻 Author

## Rohan Kumar Singh

Computer Science & Engineering — AI & ML

GitHub:

https://github.com/rohanbuildai

---

# ⭐ Project Philosophy

ProjectForge is built around one core principle:

> **Build like a real product, not like a tutorial.**

The objective is to understand the engineering decisions behind every feature.

Every feature should be:

```text
Designed
   ↓
Understood
   ↓
Implemented
   ↓
Tested
   ↓
Reviewed
   ↓
Production-ready
   ↓
Committed
```

ProjectForge is a long-term exploration of:

- Backend Engineering
- REST API Design
- PostgreSQL
- Database Architecture
- Authentication
- Authorization
- Security
- Role-Based Access Control
- System Design
- Collaboration Systems
- Real-Time Systems
- AI Integration

ProjectForge is not being built to maximize the number of endpoints.

It is being built to develop the engineering ability required to design, build, debug, test, and maintain a real software system.

---

# 📜 License

License information will be added as ProjectForge approaches its public release.

---

<p align="center">
  Built with ❤️, JavaScript, Node.js, Express.js & PostgreSQL.
</p>

<p align="center">
  <strong>ProjectForge — Build. Collaborate. Ship.</strong>
</p>
