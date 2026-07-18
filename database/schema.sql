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