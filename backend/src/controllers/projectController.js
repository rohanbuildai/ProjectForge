const projectService = require("../services/project.service");

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    const result = await projectService.createProject({
      userId,
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
    const userId = req.user.id;
    const { search } = req.query;

    const result = await projectService.getProjects({
      userId,
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
    const projectId = req.params.id;
    const userId = req.user.id;

    const result = await projectService.getProjectById({
      projectId,
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
    const projectId = req.params.id;
    const userId = req.user.id;
    const { title, description } = req.body;

    const result = await projectService.updateProject({
      projectId,
      userId,
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
    const projectId = req.params.id;
    const userId = req.user.id;

    const result = await projectService.deleteProject({
      projectId,
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

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};