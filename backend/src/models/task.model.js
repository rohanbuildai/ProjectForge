const pool = require("../config/db");

const getProjectById = async (projectId) => {
  const result = await pool.query(
    `SELECT *
     FROM projects
     WHERE id = $1`,
    [projectId],
  );

  return result.rows[0];
};

const getProjectByWorkspace = async ({ projectId, workspaceId }) => {
  const result = await pool.query(
    `SELECT *
     FROM projects
     WHERE id = $1
     AND workspace_id = $2`,
    [projectId, workspaceId],
  );

  return result.rows[0];
};

const createTask = async ({
  projectId,
  title,
  description,
  priority,
  dueDate,
  assignedTo,
}) => {
  const result = await pool.query(
    `INSERT INTO tasks(
        project_id,
        title,
        description,
        priority,
        due_date,
        assigned_to
    )
    VALUES($1,$2,$3,$4,$5,$6)
    RETURNING *`,
    [projectId, title, description, priority, dueDate, assignedTo],
  );

  return result.rows[0];
};

const getTaskById = async ({ taskId }) => {
  const result = await pool.query(
    `SELECT
    t.*,
    u.id AS assignee_id,
    u.name AS assignee_name,
    u.email AS assignee_email
FROM tasks t
LEFT JOIN users u
ON t.assigned_to = u.id
WHERE t.id = $1;`,
    [taskId],
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
  assignedTo,
  updateAssignee,
}) => {
  const result = await pool.query(
    `UPDATE tasks
     SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        priority = COALESCE($3, priority),
        status = COALESCE($4, status),
        due_date = COALESCE($5, due_date),
        assigned_to = CASE
            WHEN $8 THEN $7
            ELSE assigned_to
        END
     WHERE id = $6
     RETURNING *`,
    [title, description, priority, status, dueDate, taskId],
  );

  return result.rows[0];
};

const deleteTask = async ({ taskId }) => {
  const result = await pool.query(
    `DELETE FROM tasks
     WHERE id = $1
     RETURNING *`,
    [taskId],
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
    SELECT
    t.*,
    u.id AS assignee_id,
    u.name AS assignee_name,
    u.email AS assignee_email
    FROM tasks t
    LEFT JOIN users u
    ON t.assigned_to = u.id
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
    countValues,
  );

  const result = await pool.query(query, values);

  return {
    tasks: result.rows,
    totalTasks: Number(totalResult.rows[0].count),
  };
};

module.exports = {
  getProjectById,
  getProjectByWorkspace,
  createTask,
  getTaskById,
  updateTask,
  getTasksByProject,
  deleteTask,
};
