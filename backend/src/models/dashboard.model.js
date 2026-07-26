const pool = require("../config/db");

const getDashboardData = async (userId) => {
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
    pool.query(
      `SELECT COUNT(*)
       FROM projects
       WHERE user_id = $1`,
      [userId]
    ),

    pool.query(
      `SELECT COUNT(*)
       FROM tasks
       WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE user_id = $1
       )`,
      [userId]
    ),

    pool.query(
      `SELECT COUNT(*)
       FROM tasks
       WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE user_id = $1
       )
       AND status = 'completed'`,
      [userId]
    ),

    pool.query(
      `SELECT COUNT(*)
       FROM tasks
       WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE user_id = $1
       )
       AND status = 'in_progress'`,
      [userId]
    ),

    pool.query(
      `SELECT COUNT(*)
       FROM tasks
       WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE user_id = $1
       )
       AND status = 'todo'`,
      [userId]
    ),

    pool.query(
      `SELECT COUNT(*)
       FROM tasks
       WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE user_id = $1
       )
       AND priority = 'high'`,
      [userId]
    ),

    pool.query(
      `SELECT COUNT(*)
       FROM tasks
       WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE user_id = $1
       )
       AND due_date < CURRENT_DATE
       AND status <> 'completed'`,
      [userId]
    ),

    pool.query(
      `SELECT
          id,
          title,
          description,
          created_at
       FROM projects
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    ),

    pool.query(
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
       WHERE p.user_id = $1
       ORDER BY t.created_at DESC
       LIMIT 5`,
      [userId]
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