const pool = require("../config/db");

const getProjectById = async (projectId) => {
  const result = await pool.query(
    `SELECT *
     FROM projects
     WHERE id = $1`,
    [projectId]
  );

  return result.rows[0];
};

const getProjectByUser = async (projectId, userId) => {
  const result = await pool.query(
    `SELECT *
     FROM projects
     WHERE id = $1
     AND user_id = $2`,
    [projectId, userId]
  );

  return result.rows[0];
};

const createTask = async ({
  projectId,
  title,
  description,
  priority,
  dueDate,
}) => {
  const result = await pool.query(
    `INSERT INTO tasks(
        project_id,
        title,
        description,
        priority,
        due_date
    )
    VALUES($1,$2,$3,$4,$5)
    RETURNING *`,
    [projectId, title, description, priority, dueDate]
  );

  return result.rows[0];
};

const getTaskById = async (taskId) => {
  const result = await pool.query(
    `SELECT *
     FROM tasks
     WHERE id = $1`,
    [taskId]
  );

  return result.rows[0];
};

const updateTask = async ({
  taskId,
  title,
  description,
  priority,
  status,
  dueDate,
}) => {
  const result = await pool.query(
    `UPDATE tasks
     SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        priority = COALESCE($3, priority),
        status = COALESCE($4, status),
        due_date = COALESCE($5, due_date)
     WHERE id = $6
     RETURNING *`,
    [title, description, priority, status, dueDate, taskId]
  );

  return result.rows[0];
};

const deleteTask = async (taskId) => {
  const result = await pool.query(
    `DELETE FROM tasks
     WHERE id = $1
     RETURNING *`,
    [taskId]
  );

  return result.rows[0];
};

const getTasksByProject = async ({
  projectId,
  search,
  status,
  priority,
  sortBy,
  order,
  page,
  limit,
}) => {
  const offset = (page - 1) * limit;

  const validSortFields = [
    "title",
    "status",
    "priority",
    "due_date",
    "created_at",
  ];

  const validOrders = ["asc", "desc"];

  let query = `
    SELECT *
    FROM tasks
    WHERE project_id = $1
  `;

  let values = [projectId];

  if (status) {
    values.push(status);
    query += ` AND status = $${values.length}`;
  }

  if (priority) {
    values.push(priority);
    query += ` AND priority = $${values.length}`;
  }

  if (search) {
    values.push(`%${search}%`);
    query += ` AND title ILIKE $${values.length}`;
  }

  const countQuery = query;
  const countValues = [...values];

  if (validSortFields.includes(sortBy) && validOrders.includes(order)) {
    query += ` ORDER BY ${sortBy} ${order}`;
  } else {
    query += ` ORDER BY due_date ASC`;
  }

  values.push(limit);
  const limitIndex = values.length;

  values.push(offset);
  const offsetIndex = values.length;

  query += ` LIMIT $${limitIndex} OFFSET $${offsetIndex}`;

  const totalResult = await pool.query(
    countQuery.replace("SELECT *", "SELECT COUNT(*)"),
    countValues
  );

  const result = await pool.query(query, values);

  return {
    tasks: result.rows,
    totalTasks: Number(totalResult.rows[0].count),
  };
};

module.exports = {
    getProjectById,
    getProjectByUser,
    createTask,
    getTaskById,
    updateTask,
    getTasksByProject,
    deleteTask
}