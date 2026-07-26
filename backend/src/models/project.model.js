const pool = require("../config/db");

const createProject = async ({ userId, title, description }) => {
  const query = `
    INSERT INTO projects (user_id, title, description)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [userId, title, description];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getProjects = async ({ userId }) => {
  const query = `
    SELECT *
    FROM projects
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

const searchProjects = async ({ userId, search }) => {
  const query = `
    SELECT *
    FROM projects
    WHERE user_id = $1
      AND (
        title ILIKE $2
        OR description ILIKE $2
      )
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query, [userId, `%${search}%`]);

  return result.rows;
};

const getProjectById = async ({ projectId, userId }) => {
  const query = `
    SELECT *
    FROM projects
    WHERE id = $1
      AND user_id = $2;
  `;

  const result = await pool.query(query, [projectId, userId]);

  return result.rows[0];
};

const updateProject = async ({
  projectId,
  userId,
  title,
  description,
}) => {
  const query = `
    UPDATE projects
    SET
      title = $1,
      description = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
      AND user_id = $4
    RETURNING *;
  `;

  const values = [
    title,
    description,
    projectId,
    userId,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const deleteProject = async ({ projectId, userId }) => {
  const query = `
    DELETE FROM projects
    WHERE id = $1
      AND user_id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [projectId, userId]);

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