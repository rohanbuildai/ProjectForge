const pool = require("../config/db");
const taskService = require("../services/task.service")

const createTask = async (req, res) => {
  try {
    const { projectId, title, description, priority, dueDate } = req.body;

    const result = await taskService.createTask({
      userId: req.user.id,
      projectId,
      title,
      description,
      priority,
      dueDate,
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

const getTasksByProject = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);

    const {
      search,
      status,
      priority,
      sortBy,
      order,
    } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await taskService.getTasksByProject({
      projectId,
      userId: req.user.id,
      search,
      status,
      priority,
      sortBy,
      order,
      page,
      limit,
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

const getSingleTask = async (req, res) => {
  try {
    const taskId = Number(req.params.taskId);

    const result = await taskService.getSingleTask({
      taskId,
      userId: req.user.id,
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
const updateTask = async (req, res) => {
  try {
    const taskId = Number(req.params.taskId);

    const { title, description, priority, status, dueDate } = req.body;

    const result = await taskService.updateTask({
      taskId,
      userId: req.user.id,
      title,
      description,
      priority,
      status,
      dueDate,
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

const deleteTask = async (req, res) => {
  try {
    const taskId = Number(req.params.taskId);

    const result = await taskService.deleteTask({
      taskId,
      userId: req.user.id,
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
  createTask,
  getTasksByProject,
  getSingleTask,
  updateTask,
  deleteTask,
};
