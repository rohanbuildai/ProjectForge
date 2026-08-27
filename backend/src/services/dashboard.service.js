const pool = require("../config/db");
const dashboardModel = require("../models/dashboard.model");
const workspaceMemberModel = require("../models/workspaceMember.model");

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const buildTaskActivity = (rows) => {
  const byDate = {};
  for (const row of rows) {
    byDate[String(row.date).slice(0, 10)] = row.count;
  }

  const today = new Date();
  const activity = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);

    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, "0");
    const dateNum = String(day.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${dateNum}`;

    activity.push({
      date: dateKey,
      day: WEEKDAY_LABELS[day.getDay()],
      count: byDate[dateKey] || 0,
      isToday: offset === 0,
    });
  }

  return activity;
};

const deriveProjectTone = (progress, taskCount) => {
  if (taskCount === 0) return { label: "Not started", tone: "neutral" };
  if (progress === 100) return { label: "Completed", tone: "green" };
  if (progress >= 60) return { label: "On track", tone: "green" };
  if (progress >= 30) return { label: "At risk", tone: "amber" };
  return { label: "On hold", tone: "neutral" };
};

const buildRecentProjects = (projectRows, memberRows) => {
  const membersByProject = {};

  for (const row of memberRows) {
    const projectId = Number(row.project_id);

    if (!projectId) continue;

    if (!membersByProject[projectId]) {
      membersByProject[projectId] = [];
    }

    if (row.user_id) {
      membersByProject[projectId].push({
        id: row.user_id,
        name: row.user_name,
      });
    }
  }

  return projectRows.map((project) => {
    const projectId = Number(project.id);
    const taskCount = Number(project.task_count || 0);
    const completedCount = Number(project.completed_count || 0);
    const memberCount = Number(project.member_count || 0);

    const progress =
      taskCount === 0
        ? 0
        : Math.round((completedCount / taskCount) * 100);

    const tone = deriveProjectTone(progress, taskCount);

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      created_at: project.created_at,
      task_count: taskCount,
      completed_count: completedCount,
      member_count: memberCount,
      progress,
      status: tone.label,
      tone: tone.tone,
      members: membersByProject[projectId] || [],
    };
  });
};

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

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const recentProjects = buildRecentProjects(
    result.resultOfProjectStats.rows,
    result.resultOfProjectMembers.rows
  );

  const recentTasks = result.resultOfRecentTasks.rows;

  const taskActivity = buildTaskActivity(result.resultOfTaskActivity.rows);

  const recentActivity = result.resultOfRecentActivityLogs.rows;

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
      taskActivity,
      recentActivity,
    },
  };
}catch(error) {
  console.error(error)

  throw error
}finally{
  client.release();
};
  }
  
 

module.exports = {
  getDashboard,
};