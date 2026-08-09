const pool = require("../config/db");

const createProject = async ({ userId, workspaceId, title, description }) => {
  const query = `
   INSERT INTO projects (user_id, workspace_id, title, description)
VALUES ($1, $2, $3, $4)
RETURNING *;
  `;

  const values = [userId, workspaceId, title, description];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getProjects = async ({ workspaceId }) => {
  const query = `
    SELECT *
    FROM projects
    WHERE workspace_id = $1
    ORDER BY created_at DESC;
  `;

  const values = [ workspaceId ] ;

  const result = await pool.query(query, values);

  return result.rows;
};

const searchProjects = async ({ workspaceId, search }) => {
  const query = `
    SELECT *
    FROM projects
    WHERE workspace_id = $1
      AND (
        title ILIKE $2
        OR description ILIKE $2
      )
    ORDER BY created_at DESC;
  `;

  const values = [workspaceId, `%${search}%`]

  const result = await pool.query(query, values);

  return result.rows;
};

const getProjectById = async ( { projectId, workspaceId } ) => {
  const query = `
    SELECT *
    FROM projects
    WHERE id = $1
      AND workspace_id = $2;
  `;

  const values = [projectId, workspaceId]

  const result = await pool.query(query, values);

  return result.rows[0];
};

const updateProject = async ({ projectId, workspaceId, title, description }) => {
  const query = `
    UPDATE projects
    SET
      title = $1,
      description = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
      AND workspace_id = $4
    RETURNING *;
  `;

  const values = [title, description, projectId, workspaceId];

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

  const values = [projectId, workspaceId]

  const result = await pool.query(query, values );

  return result.rows[0];
};

module.exports = {
  createProject,
  getProjects,
  searchProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
