const projectService = require("../services/project.service");

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { workspaceId } = req.params ;
    const { id } = req.user ;

    const result = await projectService.createProject({
      userId : id,
      workspaceId,
      title,
      description,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const { id } = req.user ;
    const { workspaceId } = req.params;
    const { search } = req.query;

    const result = await projectService.getProjects({
      userId : id,
      workspaceId,
      search,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { workspaceId, projectId } = req.params;
    const userId = req.user.id;

    const result = await projectService.getProjectById({
      projectId,
      workspaceId,
      userId,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { workspaceId, projectId } = req.params;
    const { title, description } = req.body;
    const { id } = req.user;

    const result = await projectService.updateProject({
      projectId,
      workspaceId,
      userId : id,
      title,
      description,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { workspaceId, projectId } = req.params;
    const { id } = req.user;

    const result = await projectService.deleteProject({
      projectId,
      workspaceId,
      userId : id,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};