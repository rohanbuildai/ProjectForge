CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE tasks (

    id SERIAL PRIMARY KEY,

    project_id INTEGER NOT NULL
        REFERENCES projects(id)
        ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    status VARCHAR(20)
        NOT NULL
        DEFAULT 'todo'
        CHECK (status IN ('todo', 'in_progress', 'completed')),

    priority VARCHAR(20)
        NOT NULL
        DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high')),

    due_date DATE,

    created_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_tasks_project_id
ON tasks(project_id);


CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workspace Role
CREATE TYPE workspace_role AS ENUM (
    'OWNER',
    'ADMIN',
    'MEMBER'
);

-- Invitation Role
CREATE TYPE invitation_role AS ENUM (
    'ADMIN',
    'MEMBER'
);

-- Invitation Status
CREATE TYPE invitation_status AS ENUM (
    'PENDING',
    'ACCEPTED',
    'EXPIRED',
    'REVOKED'
);

CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    description TEXT,

    created_by INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_workspaces_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE workspace_members (
    id SERIAL PRIMARY KEY,

    workspace_id INT NOT NULL,

    user_id INT NOT NULL,

    role workspace_role NOT NULL,

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_workspace
        FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_workspace_member
        UNIQUE(workspace_id, user_id)
);

-- ============================================================================
-- Missing columns required by existing models
-- ============================================================================

-- projects now require a workspace scope (project.model.js references workspace_id)
ALTER TABLE projects
    ADD COLUMN workspace_id INT NOT NULL,
    ADD CONSTRAINT fk_projects_workspace
        FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE;

-- tasks now support assignment to a user (task.model.js references assigned_to)
ALTER TABLE tasks
    ADD COLUMN assigned_to INT REFERENCES users(id),
    ADD CONSTRAINT fk_tasks_assigned_to
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE CASCADE;

-- ============================================================================
-- Workspace Invitations
-- Backed by model: backend/src/models/workspaceInvitation.model.js
-- ============================================================================

CREATE TABLE workspace_invitations (
    id SERIAL PRIMARY KEY,

    workspace_id INT NOT NULL,

    email TEXT NOT NULL,

    role invitation_role NOT NULL DEFAULT 'MEMBER',

    token_hash TEXT NOT NULL,
    token_hash_hash TEXT,
    expires_at TIMESTAMP NOT NULL,

    invited_by INT NOT NULL,

    status invitation_status NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_invitations_workspace
        FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_invitations_invited_by
        FOREIGN KEY (invited_by)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_invitation_token_hash
        UNIQUE(token_hash)
);

-- Prevent multiple simultaneous PENDING invitations for the same workspace/email
CREATE UNIQUE INDEX idx_workspace_invitations_pending
ON workspace_invitations(workspace_id, email)
WHERE status = 'PENDING';

-- ============================================================================
-- Task Comments
-- Backed by model: backend/src/models/taskComments.model.js
-- ============================================================================

CREATE TABLE task_comments (
    id SERIAL PRIMARY KEY,

    task_id INT NOT NULL,

    user_id INT NOT NULL,

    content TEXT NOT NULL
        CHECK (length(trim(content)) > 0),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_task_comments_task
        FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_task_comments_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_task_comments_task_id
ON task_comments(task_id);

-- ============================================================================
-- Task Attachments
-- Backed by model: backend/src/models/taskAttachments.model.js
-- ============================================================================

CREATE TABLE task_attachments (
    id SERIAL PRIMARY KEY,

    task_id INT NOT NULL,

    uploaded_by INT NOT NULL,

    file_name TEXT NOT NULL,

    object_key TEXT NOT NULL,

    file_type TEXT,

    file_size BIGINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_task_attachments_task
        FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_task_attachments_uploader
        FOREIGN KEY (uploaded_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_task_attachments_task_id
ON task_attachments(task_id);

-- ============================================================================
-- Notifications
-- backed by model: backend/src/models/notifications.model.js
-- ============================================================================

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,

    user_id INT NOT NULL,

    type TEXT NOT NULL,

    title TEXT NOT NULL,

    message TEXT NOT NULL,

    entity_type TEXT,

    entity_id INT,

    metadata JSONB,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id
ON notifications(user_id);

-- ============================================================================
-- Activity Logs
-- backed by model: backend/src/models/activityLogs.model.js
-- ============================================================================

CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,

    workspace_id INT NOT NULL,

    user_id INT NOT NULL,

    action TEXT NOT NULL,

    entity_type TEXT NOT NULL,

    entity_id INT NOT NULL,

    metadata JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_logs_workspace
        FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_activity_logs_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_activity_logs_workspace_id
ON activity_logs(workspace_id);

-- ============================================================================
-- Project lifecycle status
-- Projects page: summary counts, status filter, status badges
-- ============================================================================

ALTER TABLE projects
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active',
    ADD CONSTRAINT chk_projects_status
        CHECK (status IN ('active', 'in_progress', 'completed', 'archived'));