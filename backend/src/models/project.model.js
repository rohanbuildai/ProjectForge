const pool = require("../config/db");

const createProject = async ({ userId, workspaceId, title, description, status }) => {
  const query = `
   INSERT INTO projects (user_id, workspace_id, title, description, status)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
  `;

  const values = [userId, workspaceId, title, description, status];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const SORT_COLUMNS = {
  updated_at: "p.updated_at",
  created_at: "p.created_at",
  title: "p.title",
  progress: `
    (SELECT COUNT(*)::float FROM tasks t
     WHERE t.project_id = p.id AND t.status = 'completed')
    / NULLIF((SELECT COUNT(*)::float FROM tasks t
     WHERE t.project_id = p.id), 0)
  `,
};

const getProjects = async ({ workspaceId, search, status, sortBy, order }) => {
  const sortColumn = SORT_COLUMNS[sortBy] || SORT_COLUMNS.updated_at;
  const sortDirection = order === "asc" ? "ASC" : "DESC";
  const nullsLast = sortBy === "progress" ? " NULLS LAST" : "";

  let query = `
    SELECT
      p.id,
      p.user_id,
      p.title,
      p.description,
      p.status,
      p.created_at,
      p.updated_at,
      p.workspace_id,
      (SELECT COUNT(*)::int
       FROM tasks t
       WHERE t.project_id = p.id) AS task_count,
      (SELECT COUNT(*)::int
       FROM tasks t
       WHERE t.project_id = p.id
         AND t.status = 'completed') AS completed_count,
      (SELECT COUNT(DISTINCT t.assigned_to)::int
       FROM tasks t
       WHERE t.project_id = p.id
         AND t.assigned_to IS NOT NULL) AS member_count
    FROM projects p
    WHERE p.workspace_id = $1
  `;

  const values = [workspaceId];

  if (status) {
    values.push(status);
    query += ` AND p.status = $${values.length}`;
  }

  if (search) {
    values.push(`%${search}%`);
    query += ` AND (p.title ILIKE $${values.length}
                    OR p.description ILIKE $${values.length})`;
  }

  query += ` ORDER BY ${sortColumn} ${sortDirection}${nullsLast}, p.id DESC`;

  const result = await pool.query(query, values);

  return result.rows;
};

const getProjectMembers = async ({ workspaceId }) => {
  const query = `
    SELECT DISTINCT
      t.project_id,
      u.id AS user_id,
      u.name AS user_name
    FROM tasks t
    JOIN users u
      ON t.assigned_to = u.id
    WHERE t.project_id IN (
      SELECT id
      FROM projects
      WHERE workspace_id = $1
    )
    ORDER BY t.project_id;
  `;

  const result = await pool.query(query, [workspaceId]);

  return result.rows;
};

const getProjectStatistics = async ({ workspaceId }) => {
  const query = `
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'active')::int AS active,
      COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress,
      COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
      COUNT(*) FILTER (WHERE status = 'archived')::int AS archived
    FROM projects
    WHERE workspace_id = $1;
  `;

  const result = await pool.query(query, [workspaceId]);

  return result.rows[0];
};

const getProjectById = async ({ projectId, workspaceId }) => {
  const query = `
    SELECT *
    FROM projects
    WHERE id = $1
      AND workspace_id = $2;
  `;

  const values = [projectId, workspaceId];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const updateProject = async ({
  projectId,
  workspaceId,
  title,
  description,
  status,
}) => {
  const query = `
    UPDATE projects
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      status = COALESCE($3, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
      AND workspace_id = $5
    RETURNING *;
  `;

  const values = [title, description, status, projectId, workspaceId];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const deleteProject = async ({ projectId, workspaceId }) => {
  const query = `
    DELETE FROM projects
    WHERE id = $1
    AND workspace_id = $2
    RETURNING *;
  `;

  const values = [projectId, workspaceId];

  const result = await pool.query(query, values);

  return result.rows[0];
};

module.exports = {
  createProject,
  getProjects,
  getProjectMembers,
  getProjectStatistics,
  getProjectById,
  updateProject,
  deleteProject,
};