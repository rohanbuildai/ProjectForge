# ProjectForge Database Design

## Overview

This document defines the complete database architecture of ProjectForge.

The database is designed using relational database principles with PostgreSQL and follows normalization, scalability, and maintainability best practices.

---

# Design Goals

- Scalable
- Secure
- Normalized
- Production Ready
- Easy to Extend

---

# Business Rules

- A user can create multiple workspaces.
- A user can join multiple workspaces.
- A workspace can contain multiple users.
- Every workspace has exactly one Owner.
- A workspace can have multiple Admins.
- A workspace can have multiple Members.
- Projects belong to a workspace.
- Tasks belong to a project.
- Users become members only after accepting invitations.
- Deleting a user should not unintentionally destroy shared workspace data.

---

# Entities

| Table | Purpose |
|--------|---------|
| users | Stores registered users |
| refresh_tokens | Stores login sessions |
| workspaces | Stores collaborative workspaces |
| workspace_members | Stores workspace membership and roles |
| workspace_invitations | Stores pending invitations |
| projects | Stores workspace projects |
| tasks | Stores project tasks |

---

# Entity Relationship Diagram

```
Users
│
├── Refresh Tokens
├── Workspace Members
└── Workspace Invitations
        │
        ▼
    Workspaces
        │
        ├── Projects
        │      │
        │      ▼
        │     Tasks
        │
        └── Members
```

---

# Relationships

| Parent | Child | Relationship |
|----------|--------|--------------|
| User | Refresh Tokens | One-to-Many |
| User | Workspace | Many-to-Many (workspace_members) |
| Workspace | Workspace Members | One-to-Many |
| Workspace | Workspace Invitations | One-to-Many |
| Workspace | Projects | One-to-Many |
| Project | Tasks | One-to-Many |

---

# Tables

## users

### Purpose

Stores registered users.

| Column | Description |
|----------|-------------|
| id | Primary Key |
| name | Full name |
| email | Unique email |
| password | Hashed password |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |

---

## refresh_tokens

### Purpose

Stores active login sessions.

| Column | Description |
|----------|-------------|
| id | Primary Key |
| user_id | User reference |
| token | Refresh token |
| expires_at | Expiration time |
| created_at | Creation timestamp |

---

## workspaces

### Purpose

Represents a collaborative workspace.

| Column | Description |
|----------|-------------|
| id | Primary Key |
| name | Workspace name |
| description | Optional description |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |

---

## workspace_members

### Purpose

Represents the many-to-many relationship between Users and Workspaces.

Stores workspace roles.

| Column | Description |
|----------|-------------|
| id | Primary Key |
| workspace_id | Workspace reference |
| user_id | User reference |
| role | OWNER / ADMIN / MEMBER |
| joined_at | Joining timestamp |

---

## workspace_invitations

### Purpose

Stores invitations that have not yet been accepted.

| Column | Description |
|----------|-------------|
| id | Primary Key |
| workspace_id | Workspace reference |
| invited_by | User who sent invitation |
| email | Invited email |
| role | ADMIN / MEMBER |
| token | Invitation token |
| status | PENDING / ACCEPTED / EXPIRED |
| expires_at | Expiration time |
| created_at | Creation timestamp |

---

## projects

### Purpose

Stores projects inside a workspace.

| Column | Description |
|----------|-------------|
| id | Primary Key |
| workspace_id | Workspace reference |
| name | Project name |
| description | Optional description |
| status | ACTIVE / COMPLETED / ARCHIVED |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |

---

## tasks

### Purpose

Stores tasks belonging to projects.

| Column | Description |
|----------|-------------|
| id | Primary Key |
| project_id | Project reference |
| title | Task title |
| description | Optional description |
| priority | LOW / MEDIUM / HIGH |
| status | TODO / IN_PROGRESS / DONE |
| due_date | Optional due date |
| created_at | Creation timestamp |
| updated_at | Last update timestamp |

---

# Constraints

## users

- email must be unique

---

## workspace_members

- UNIQUE(workspace_id, user_id)

One user cannot join the same workspace twice.

---

## workspace_invitations

- token must be unique

---

## refresh_tokens

- token must be unique

---

# Foreign Keys

| Parent | Child | On Delete |
|----------|--------|-----------|
| users | refresh_tokens | CASCADE |
| users | workspace_members | CASCADE |
| workspaces | workspace_members | CASCADE |
| workspaces | workspace_invitations | CASCADE |
| workspaces | projects | CASCADE |
| projects | tasks | CASCADE |

---

# Roles

ProjectForge v1 supports three workspace roles.

## Owner

- Create workspace
- Delete workspace
- Transfer ownership
- Invite members
- Remove members
- Manage roles

---

## Admin

- Manage projects
- Manage tasks
- Invite members
- Remove members

Cannot transfer ownership.

---

## Member

- Access workspace
- Access projects
- Create and manage tasks (subject to permissions)

Cannot manage workspace settings.

---

# Scalability

The current design supports future upgrades without major schema changes.

Possible future additions:

- Multiple Owners
- Guest Users
- Teams
- Departments
- Billing
- Enterprise Permissions
- Workspace Logo
- Workspace Settings
- Audit Logs
- Activity History

---

# Summary

ProjectForge follows a normalized relational database architecture.

Core principles:

- No duplicate data
- Strong referential integrity
- Many-to-Many relationships through junction tables
- Clear separation of business entities
- Production-ready schema
- Designed for future scalability