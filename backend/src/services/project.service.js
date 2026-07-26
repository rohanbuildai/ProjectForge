const projectModel = require("../models/project.model");

const createProject = async ({ userId, title, description }) => {
  if (!title) {
    return {
      success: false,
      status: 400,
      message: "Please enter title",
    };
  }

  const project = await projectModel.createProject({
    userId,
    title,
    description,
  });

  return {
    success: true,
    status: 201,
    message: "Project created successfully",
    data: project,
  };
};

const getProjects = async ({ userId, search }) => {
  let projects;

  if (search) {
    projects = await projectModel.searchProjects({
      userId,
      search,
    });
  } else {
    projects = await projectModel.getProjects({
      userId,
    });
  }

  return {
    success: true,
    status: 200,
    count: projects.length,
    data: projects,
  };
};

const getProjectById = async ({ projectId, userId }) => {
  const project = await projectModel.getProjectById({
    projectId,
    userId,
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
};

const updateProject = async ({
  projectId,
  userId,
  title,
  description,
}) => {
  if (!title && !description) {
    return {
      success: false,
      status: 400,
      message: "Please provide at least one field to update.",
    };
  }

  const project = await projectModel.getProjectById({
    projectId,
    userId,
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
    userId,
    title: title || project.title,
    description: description || project.description,
  });

  return {
    success: true,
    status: 200,
    message: "Project updated successfully.",
    data: updatedProject,
  };
};

const deleteProject = async ({ projectId, userId }) => {
  const deletedProject = await projectModel.deleteProject({
    projectId,
    userId,
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
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};