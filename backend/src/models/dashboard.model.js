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
    resultOfRecentProjects,
    resultOfRecentTasks,
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
          id,
          title,
          description,
          created_at
       FROM projects
       WHERE workspace_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [workspaceId]
    ),

    client.query(
      `SELECT
          t.id,
          t.title,
          t.status,
          t.priority,
          t.due_date,
          p.title AS project_title
       FROM tasks t
       JOIN projects p
            ON t.project_id = p.id
       WHERE p.workspace_id = $1
       ORDER BY t.created_at DESC
       LIMIT 5`,
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
    resultOfRecentProjects,
    resultOfRecentTasks,
  };
};

module.exports = {
  getDashboardData,
};