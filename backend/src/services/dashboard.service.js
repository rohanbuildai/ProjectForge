const dashboardModel = require("../models/dashboard.model");

const getDashboard = async (userId) => {
  const result = await dashboardModel.getDashboardData(userId);

  const totalProjects = Number(result.resultOfProject.rows[0].count);
  const totalTasks = Number(result.resultOfTask.rows[0].count);
  const completedTasks = Number(result.resultOfCompletedTasks.rows[0].count);
  const inProgressTasks = Number(result.resultOfInProgressTasks.rows[0].count);
  const todoTasks = Number(result.resultOfTodoTasks.rows[0].count);
  const highPriorityTasks = Number(result.resultOfHighPriorityTasks.rows[0].count);
  const overdueTasks = Number(result.resultOfOverdueTasks.rows[0].count);

  const recentProjects = result.resultOfRecentProjects.rows;
  const recentTasks = result.resultOfRecentTasks.rows;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return {
    success: true,
    status: 200,
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
  };
};

module.exports = {
  getDashboard,
};