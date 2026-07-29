const pool = require("../config/db");
const dashboardModel = require("../models/dashboard.model");
const workspaceMemberModel = require("../models/workspaceMember.model");

const getDashboard = async ({ userId , workspaceId } ) => {
  const client = await pool.connect();

  try{

     const workspaceMember = await workspaceMemberModel.getWorkspaceMember({
      client,
      userId,
      workspaceId
    });

    if (!workspaceMember) {
      return {
        success: false,
        status: 403,
        message: "Access denied. You are not a member of this workspace.",
      };
    }

     const result = await dashboardModel.getDashboardData({
     client,
     workspaceId,
  });

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
}catch(error) {
  console.error(error)

  throw error
}finally{
  client.release() ;
};
  }
  
 

module.exports = {
  getDashboard,
};