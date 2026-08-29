const pool = require("../config/db");
const projectModel = require("../models/project.model");
const workspaceMemberModel = require("../models/workspaceMember.model");
const activityLogsService = require("../services/activityLogs.service");

const PROJECT_STATUSES = ["active", "in_progress", "completed", "archived"];
const SORT_FIELDS = ["updated_at", "created_at", "title", "progress"];

const logActivity = async ({ workspaceId, userId, action, entityType, entityId, metadata }) => {
  try {
    await activityLogsService.createActivityLog({
      workspaceId,
      userId,
      action,
      entityType,
      entityId,
      metadata,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

const verifyWorkspaceAccess = async (workspaceId, userId) => {
  const client = await pool.connect();
  try {
    const member = await workspaceMemberModel.getWorkspaceMember({
      client,
      userId,
      workspaceId,
    });

    if (!member) {
      return {
        success: false,
        status: 403,
        message: "You do not have access to this workspace.",
      };
    }

    return null;
  } catch (error) {
    console.error(error);

    throw error;
  } finally {
    client.release();
  }
};

const createProject = async ({ workspaceId, userId, title, description, status }) => {
  const client = await pool.connect();

  try {
    if (!title) {
      return {
        success: false,
        status: 400,
        message: "Please enter title",
      };
    }

    if (status && !PROJECT_STATUSES.includes(status)) {
      return {
        success: false,
        status: 400,
        message: "Invalid project status.",
      };
    }

    const accessError = await verifyWorkspaceAccess(workspaceId, userId);

    if (accessError) return accessError;

    const project = await projectModel.createProject({
      userId,
      workspaceId,
      title,
      description,
      status: status || "active",
    });

    await logActivity({
      workspaceId,
      userId,
      action: "created",
      entityType: "project",
      entityId: project.id,
      metadata: {
        title: project.title,
      },
    });

    return {
      success: true,
      status: 201,
      message: "Project created successfully",
      data: project,
    };
  } catch (error) {
    console.error(error);

    throw error;
  } finally {
    client.release();
  }
};

const getProjects = async ({ workspaceId, userId, search, status, sortBy, order }) => {
  const client = await pool.connect();

  try {
    const accessError = await verifyWorkspaceAccess(workspaceId, userId);

    if (accessError) return accessError;

    if (status && !PROJECT_STATUSES.includes(status)) {
      return {
        success: false,
        status: 400,
        message: "Invalid project status.",
      };
    }

    const normalizedSort = SORT_FIELDS.includes(sortBy) ? sortBy : "updated_at";
    const normalizedOrder = order === "asc" ? "asc" : "desc";

    const [projects, members, statistics] = await Promise.all([
      projectModel.getProjects({
        workspaceId,
        search,
        status,
        sortBy: normalizedSort,
        order: normalizedOrder,
      }),
      projectModel.getProjectMembers({ workspaceId }),
      projectModel.getProjectStatistics({ workspaceId }),
    ]);

    const membersByProject = {};

    for (const row of members) {
      const projectId = Number(row.project_id);

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

    const data = projects.map((project) => {
      const taskCount = Number(project.task_count || 0);
      const completedCount = Number(project.completed_count || 0);

      const progress =
        taskCount === 0
          ? 0
          : Math.round((completedCount / taskCount) * 100);

      return {
        ...project,
        task_count: taskCount,
        completed_count: completedCount,
        member_count: Number(project.member_count || 0),
        progress,
        members: membersByProject[Number(project.id)] || [],
      };
    });

    return {
      success: true,
      status: 200,
      count: data.length,
      statistics,
      data,
    };
  } catch (error) {
    console.error(error);

    throw error;
  } finally {
    client.release();
  }
};

const getProjectById = async ({ workspaceId, projectId, userId }) => {
  const client = await pool.connect();

  try {
    const accessError = await verifyWorkspaceAccess(workspaceId, userId);

    if (accessError) return accessError;

    const project = await projectModel.getProjectById({
      projectId,
      workspaceId,
    });

    if (!project) {
      return {
        success: false,
        status: 404,
        message: "Project not found",
      };
    }

    return {
      success: true,
      status: 200,
      data: project,
    };
  } catch (error) {
    console.error(error);

    throw error;
  } finally {
    client.release();
  }
};

const updateProject = async ({
  workspaceId,
  projectId,
  userId,
  title,
  description,
  status,
}) => {
  const client = await pool.connect();

  try {
    const accessError = await verifyWorkspaceAccess(workspaceId, userId);

    if (accessError) return accessError;

    if (status && !PROJECT_STATUSES.includes(status)) {
      return {
        success: false,
        status: 400,
        message: "Invalid project status.",
      };
    }

    if (!title && !description && !status) {
      return {
        success: false,
        status: 400,
        message: "Please provide at least one field to update.",
      };
    }

    const project = await projectModel.getProjectById({
      projectId,
      workspaceId,
    });

    if (!project) {
      return {
        success: false,
        status: 404,
        message: "Project not found",
      };
    }

    const updatedProject = await projectModel.updateProject({
      projectId,
      workspaceId,
      title: title || null,
      description: description || null,
      status: status || null,
    });

    await logActivity({
      workspaceId,
      userId,
      action: "updated",
      entityType: "project",
      entityId: projectId,
      metadata: {
        title: updatedProject.title,
      },
    });

    return {
      success: true,
      status: 200,
      message: "Project updated successfully.",
      data: updatedProject,
    };
  } catch (error) {
    console.error(error);

    throw error;
  } finally {
    client.release();
  }
};

const deleteProject = async ({ workspaceId, projectId, userId }) => {
  const client = await pool.connect();

  try {
    const accessError = await verifyWorkspaceAccess(workspaceId, userId);

    if (accessError) return accessError;

    const deletedProject = await projectModel.deleteProject({
      projectId,
      workspaceId,
    });

    if (!deletedProject) {
      return {
        success: false,
        status: 404,
        message: "Project not found",
      };
    }

    await logActivity({
      workspaceId,
      userId,
      action: "deleted",
      entityType: "project",
      entityId: projectId,
      metadata: {
        title: deletedProject.title,
      },
    });

    return {
      success: true,
      status: 200,
      message: "Project deleted successfully.",
      data: deletedProject,
    };
  } catch (error) {
    console.error(error);

    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};