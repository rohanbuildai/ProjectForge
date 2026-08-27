const pool = require("../config/db");

const getDashboardData = async ( { client , workspaceId } ) => {
  const [
    resultOfProject,
    resultOfTask,
    resultOfCompletedTasks,
    resultOfInProgressTasks,
    resultOfTodoTasks,
    resultOfHighPriorityTasks,
    resultOfOverdueTasks,
    resultOfRecentTasks,
    resultOfTaskActivity,
    resultOfProjectStats,
    resultOfProjectMembers,
    resultOfRecentActivityLogs,
  ] = await Promise.all([
    client.query(
      `SELECT COUNT(*)
       FROM projects
       WHERE workspace_id = $1`,
      [workspaceId]
    ),

    client.query(
      `SELECT COUNT(*)
       FROM tasks
       WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE workspace_id = $1
       )`,
      [workspaceId]
    ),

    client.query(
      `SELECT COUNT(*)
       FROM tasks
       WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE workspace_id = $1
       )
       AND status = 'completed'`,
      [workspaceId]
    ),

    client.query(
      `SELECT COUNT(*)
       FROM tasks
       WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE workspace_id = $1
       )
       AND status = 'in_progress'`,
      [workspaceId]
    ),

    client.query(
      `SELECT COUNT(*)
       FROM tasks
       WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE workspace_id = $1
       )
       AND status = 'todo'`,
      [workspaceId]
    ),

    client.query(
      `SELECT COUNT(*)
       FROM tasks
       WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE workspace_id = $1
       )
       AND priority = 'high'`,
      [workspaceId]
    ),

    client.query(
      `SELECT COUNT(*)
       FROM tasks
       WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE workspace_id = $1
       )
       AND due_date < CURRENT_DATE
       AND status <> 'completed'`,
      [workspaceId]
    ),

    client.query(
      `SELECT
          t.id,
          t.title,
          t.status,
          t.priority,
          to_char(t.due_date, 'YYYY-MM-DD') AS due_date,
          t.created_at,
          p.id AS project_id,
          p.title AS project_title,
          u.id AS assignee_id,
          u.name AS assignee_name,
          u.email AS assignee_email
       FROM tasks t
       JOIN projects p
            ON t.project_id = p.id
       LEFT JOIN users u
            ON t.assigned_to = u.id
       WHERE p.workspace_id = $1
       ORDER BY t.created_at DESC
       LIMIT 5`,
      [workspaceId]
    ),

    client.query(
      `SELECT
          to_char(t.created_at, 'YYYY-MM-DD') AS date,
          COUNT(*)::int AS count
       FROM tasks t
       JOIN projects p
            ON t.project_id = p.id
       WHERE p.workspace_id = $1
         AND t.created_at >= (CURRENT_DATE - INTERVAL '6 days')
       GROUP BY date
       ORDER BY date ASC`,
      [workspaceId]
    ),

    client.query(
      `SELECT
          p.id,
          p.title,
          p.description,
          p.created_at,
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
       ORDER BY p.created_at DESC
       LIMIT 5`,
      [workspaceId]
    ),

    client.query(
      `SELECT DISTINCT
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
            ORDER BY created_at DESC
            LIMIT 5
       )
       ORDER BY t.project_id`,
      [workspaceId]
    ),

    client.query(
      `SELECT
          al.id,
          al.workspace_id,
          al.user_id,
          u.name AS user_name,
          al.action,
          al.entity_type,
          al.entity_id,
          al.metadata,
          al.created_at
       FROM activity_logs al
       LEFT JOIN users u
            ON al.user_id = u.id
       WHERE al.workspace_id = $1
       ORDER BY al.created_at DESC
       LIMIT 6`,
      [workspaceId]
    ),
  ]);

  return {
    resultOfProject,
    resultOfTask,
    resultOfCompletedTasks,
    resultOfInProgressTasks,
    resultOfTodoTasks,
    resultOfHighPriorityTasks,
    resultOfOverdueTasks,
    resultOfRecentTasks,
    resultOfTaskActivity,
    resultOfProjectStats,
    resultOfProjectMembers,
    resultOfRecentActivityLogs,
  };
};

module.exports = {
  getDashboardData,
};