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
  status,
  dueDate,
  assignedTo,
}) => {
  const result = await pool.query(
    `INSERT INTO tasks(
        project_id,
        title,
        description,
        priority,
        status,
        due_date,
        assigned_to
    )
    VALUES($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
    [
      projectId,
      title,
      description,
      priority || "medium",
      status || "todo",
      dueDate,
      assignedTo,
    ],
  );

  return result.rows[0];
};

const getTaskById = async ({ taskId }) => {
  const result = await pool.query(
    `SELECT
        t.*,
        p.workspace_id,
        u.id AS assignee_id,
        u.name AS assignee_name,
        u.email AS assignee_email
     FROM tasks t
     JOIN projects p
        ON t.project_id = p.id
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
    [title, description, priority, status, dueDate, taskId , assignedTo , updateAssignee],
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
    WHERE t.project_id = $1
  `;

  let countQuery = `
    SELECT COUNT(*)
    FROM tasks t
    LEFT JOIN users u
      ON t.assigned_to = u.id
    WHERE t.project_id = $1
  `;

  let values = [projectId];

  if (status) {
    values.push(status);

    query += ` AND t.status = $${values.length}`;
    countQuery += ` AND t.status = $${values.length}`;
  }

  if (priority) {
    values.push(priority);

    query += ` AND t.priority = $${values.length}`;
    countQuery += ` AND t.priority = $${values.length}`;
  }

  if (search) {
    values.push(`%${search}%`);

    query += ` AND t.title ILIKE $${values.length}`;
    countQuery += ` AND t.title ILIKE $${values.length}`;
  }

  const countValues = [...values];

  if (
    validSortFields.includes(sortBy) &&
    validOrders.includes(order)
  ) {
    query += ` ORDER BY t.${sortBy} ${order}`;
  } else {
    query += ` ORDER BY t.due_date ASC`;
  }

  values.push(limit);
  const limitIndex = values.length;

  values.push(offset);
  const offsetIndex = values.length;

  query += ` LIMIT $${limitIndex} OFFSET $${offsetIndex}`;

  const totalResult = await pool.query(
    countQuery,
    countValues,
  );

  const result = await pool.query(
    query,
    values,
  );

  return {
    tasks: result.rows,
    totalTasks: Number(totalResult.rows[0].count),
  };
};

const getTasksByWorkspace = async ({
  workspaceId,
  search,
  status,
  priority,
  assignedTo,
  projectId,
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
    "updated_at",
  ];

  const validOrders = ["asc", "desc"];

  let query = `
    SELECT
      t.*,
      to_char(t.due_date, 'YYYY-MM-DD') AS due_date,
      u.id AS assignee_id,
      u.name AS assignee_name,
      u.email AS assignee_email,
      p.id AS project_id,
      p.title AS project_title
    FROM tasks t
    LEFT JOIN users u
      ON t.assigned_to = u.id
    JOIN projects p
      ON t.project_id = p.id
    WHERE p.workspace_id = $1
  `;

  let countQuery = `
    SELECT COUNT(*)
    FROM tasks t
    JOIN projects p
      ON t.project_id = p.id
    WHERE p.workspace_id = $1
  `;

  let values = [workspaceId];

  if (status) {
    values.push(status);

    query += ` AND t.status = $${values.length}`;
    countQuery += ` AND t.status = $${values.length}`;
  }

  if (priority) {
    values.push(priority);

    query += ` AND t.priority = $${values.length}`;
    countQuery += ` AND t.priority = $${values.length}`;
  }

  if (assignedTo) {
    values.push(assignedTo);

    query += ` AND t.assigned_to = $${values.length}`;
    countQuery += ` AND t.assigned_to = $${values.length}`;
  }

  if (projectId) {
    values.push(projectId);

    query += ` AND p.id = $${values.length}`;
    countQuery += ` AND p.id = $${values.length}`;
  }

  if (search) {
    values.push(`%${search}%`);

    query += ` AND (t.title ILIKE $${values.length}
                    OR t.description ILIKE $${values.length})`;
    countQuery += ` AND (t.title ILIKE $${values.length}
                    OR t.description ILIKE $${values.length})`;
  }

  const countValues = [...values];

  if (
    validSortFields.includes(sortBy) &&
    validOrders.includes(order)
  ) {
    if (sortBy === "priority") {
      const priorityOrder =
        order === "asc"
          ? `CASE t.priority WHEN 'low' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END ASC`
          : `CASE t.priority WHEN 'high' THEN 3 WHEN 'medium' THEN 2 ELSE 1 END DESC`;
      query += ` ORDER BY ${priorityOrder}, t.id DESC`;
    } else {
      query += ` ORDER BY t.${sortBy} ${order}`;
    }
  } else {
    query += ` ORDER BY t.created_at DESC`;
  }

  values.push(limit);
  const limitIndex = values.length;

  values.push(offset);
  const offsetIndex = values.length;

  query += ` LIMIT $${limitIndex} OFFSET $${offsetIndex}`;

  const totalResult = await pool.query(countQuery, countValues);

  const result = await pool.query(query, values);

  return {
    tasks: result.rows,
    totalTasks: Number(totalResult.rows[0].count),
  };
};

const getTaskStatistics = async ({ workspaceId }) => {
  const query = `
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE t.status = 'todo')::int AS todo,
      COUNT(*) FILTER (WHERE t.status = 'in_progress')::int AS in_progress,
      COUNT(*) FILTER (WHERE t.status = 'completed')::int AS completed,
      COUNT(*) FILTER (
        WHERE t.due_date < CURRENT_DATE
          AND t.status <> 'completed'
      )::int AS overdue
    FROM tasks t
    JOIN projects p
      ON t.project_id = p.id
    WHERE p.workspace_id = $1;
  `;

  const result = await pool.query(query, [workspaceId]);

  return result.rows[0];
};
module.exports = {
  getProjectById,
  getProjectByWorkspace,
  createTask,
  getTaskById,
  updateTask,
  getTasksByProject,
  getTasksByWorkspace,
  getTaskStatistics,
  deleteTask,
};
