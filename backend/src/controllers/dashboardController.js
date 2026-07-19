const pool = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const { id } = req.user;

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
    ] = await Promise.all([            // to increase the performance we have written promise.all() instead of a standard sql query
      pool.query(
        `SELECT COUNT(*)
         FROM projects
         WHERE user_id = $1;`,
        [id],
      ),

      pool.query(
        `SELECT COUNT(*)
         FROM tasks
         WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE user_id = $1
         );`,
        [id],
      ),

      pool.query(
        `SELECT COUNT(*)
         FROM tasks
         WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE user_id = $1
         )
         AND status = 'completed';`,
        [id],
      ),

      pool.query(
        `SELECT COUNT(*)
         FROM tasks
         WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE user_id = $1
         )
         AND status = 'in_progress';`,
        [id],
      ),

      pool.query(
        `SELECT COUNT(*)
         FROM tasks
         WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE user_id = $1
         )
         AND status = 'todo';`,
        [id],
      ),

      pool.query(
        `SELECT COUNT(*)
         FROM tasks
         WHERE project_id IN (
            SELECT id
            FROM projects
            WHERE user_id = $1
         )
         AND priority = 'high';`,
        [id],
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
         AND status <> 'completed';`,
        [id],
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
         LIMIT 5;`,
        [id],
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
         LIMIT 5;`,
        [id],
      ),
    ]);

    const totalProjects = Number(resultOfProject.rows[0].count);
    const totalTasks = Number(resultOfTask.rows[0].count);
    const completedTasks = Number(resultOfCompletedTasks.rows[0].count);
    const inProgressTasks = Number(resultOfInProgressTasks.rows[0].count);
    const todoTasks = Number(resultOfTodoTasks.rows[0].count);
    const highPriorityTasks = Number(resultOfHighPriorityTasks.rows[0].count);
    const overdueTasks = Number(resultOfOverdueTasks.rows[0].count);
    const recentProjects = resultOfRecentProjects.rows;
    const recentTasks = resultOfRecentTasks.rows;

    const completionPercentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return res.status(200).json({
      success: true,
      dashboard: {
        statistics: {
          totalProjects,
          totalTasks,
          completedTasks,
          inProgressTasks,
          todoTasks,
          highPriorityTasks,
          overdueTasks,
          completionPercentage,
        },
        recentProjects,
        recentTasks,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getDashboard,
};
