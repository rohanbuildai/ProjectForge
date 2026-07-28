const pool = require("../config/db");
const projectModel = require("../models/project.model");
const workspaceMemberModel = require("../models/workspaceMember.model");

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

const createProject = async ({ workspaceId, userId, title, description }) => {
  const client = await pool.connect();

  try {
    if (!title) {
      return {
        success: false,
        status: 400,
        message: "Please enter title",
      };
    }

    const accessError = await verifyWorkspaceAccess(workspaceId, userId);

    if (accessError) return accessError;

    const project = await projectModel.createProject({
      userId,
      workspaceId,
      title,
      description,
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

const getProjects = async ({ workspaceId, userId, search }) => {
  const client = await pool.connect();

  try {
    let projects;

    const accessError = await verifyWorkspaceAccess(workspaceId, userId);

    if (accessError) return accessError;

    if (search) {
      projects = await projectModel.searchProjects({
        workspaceId,
        search,
      });
    } else {
      projects = await projectModel.getProjects({
        workspaceId,
      });
    }

    return {
      success: true,
      status: 200,
      count: projects.length,
      data: projects,
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
}) => {
  const client = await pool.connect();

  try {
    const accessError = await verifyWorkspaceAccess(workspaceId, userId);

    if (accessError) return accessError;

    if (!title && !description) {
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
      title: title || project.title,
      description: description || project.description,
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
