const taskModel = require("../models/task.model");

const createTask = async ({
  userId,
  projectId,
  title,
  description,
  priority,
  dueDate,
}) => {
  const validPriorities = ["low", "medium", "high"];

  const normalizedTitle = title?.trim();

  if (!projectId || !normalizedTitle) {
    return {
      success: false,
      status: 400,
      message: "Please enter projectID and title",
    };
  }

  if (priority && !validPriorities.includes(priority)) {
    return {
      success: false,
      status: 400,
      message: "Please enter valid priority",
    };
  }

  const project = await taskModel.getProjectById(projectId);

  if (!project) {
    return {
      success: false,
      status: 404,
      message: "Project does not exist",
    };
  }

  const authorizedProject = await taskModel.getProjectByUser(
    projectId,
    userId
  );

  if (!authorizedProject) {
    return {
      success: false,
      status: 403,
      message: "You are not authorized to access this project.",
    };
  }

  const task = await taskModel.createTask({
    projectId,
    title: normalizedTitle,
    description,
    priority,
    dueDate,
  });

  return {
    success: true,
    status: 201,
    message: "Task created successfully",
    data: task,
  };
};

const getSingleTask = async ({ taskId, userId }) => {
  if (!Number.isInteger(taskId) || taskId <= 0) {
    return {
      success: false,
      status: 400,
      message: "Enter valid input",
    };
  }

  const task = await taskModel.getTaskById(taskId);

  if (!task) {
    return {
      success: false,
      status: 404,
      message: "Task does not exist",
    };
  }

  const project = await taskModel.getProjectByUser(
    task.project_id,
    userId
  );

  if (!project) {
    return {
      success: false,
      status: 403,
      message: "You are not authorized to access this project.",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Task fetched successfully",
    data: task,
  };
};

const updateTask = async ({
  taskId,
  userId,
  title,
  description,
  priority,
  status,
  dueDate,
}) => {
  const validPriorities = ["low", "medium", "high"];
  const validStatus = ["todo", "in_progress", "completed"];

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return {
      success: false,
      status: 400,
      message: "Enter valid input",
    };
  }

  if (
    title === undefined &&
    description === undefined &&
    priority === undefined &&
    status === undefined &&
    dueDate === undefined
  ) {
    return {
      success: false,
      status: 400,
      message: "Enter field to be updated",
    };
  }

  if (dueDate !== undefined && isNaN(Date.parse(dueDate))) {
    return {
      success: false,
      status: 400,
      message: "Enter a valid due date.",
    };
  }

  if (priority && !validPriorities.includes(priority)) {
    return {
      success: false,
      status: 400,
      message: "Priority must be one of: low, medium, high.",
    };
  }

  if (status && !validStatus.includes(status)) {
    return {
      success: false,
      status: 400,
      message: "Status must be one of: todo, in_progress, completed.",
    };
  }

  const task = await taskModel.getTaskById(taskId);

  if (!task) {
    return {
      success: false,
      status: 404,
      message: "Task does not exist",
    };
  }

  const project = await taskModel.getProjectByUser(
    task.project_id,
    userId
  );

  if (!project) {
    return {
      success: false,
      status: 403,
      message: "You are not authorized to access this project.",
    };
  }

  const updatedTask = await taskModel.updateTask({
    taskId,
    title,
    description,
    priority,
    status,
    dueDate,
  });

  return {
    success: true,
    status: 200,
    message: "Task updated successfully",
    data: updatedTask,
  };
};

const deleteTask = async ({ taskId, userId }) => {
  if (!Number.isInteger(taskId) || taskId <= 0) {
    return {
      success: false,
      status: 400,
      message: "Enter valid input",
    };
  }

  const task = await taskModel.getTaskById(taskId);

  if (!task) {
    return {
      success: false,
      status: 404,
      message: "Task does not exist",
    };
  }

  const project = await taskModel.getProjectByUser(
    task.project_id,
    userId
  );

  if (!project) {
    return {
      success: false,
      status: 403,
      message: "You are not authorized to access this project.",
    };
  }

  const deletedTask = await taskModel.deleteTask(taskId);

  return {
    success: true,
    status: 200,
    message: "Task deleted successfully",
    data: deletedTask,
  };
};

const getTasksByProject = async ({
  projectId,
  userId,
  search,
  status,
  priority,
  sortBy,
  order,
  page,
  limit,
}) => {
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return {
      success: false,
      status: 400,
      message: "Enter valid input",
    };
  }

  const project = await taskModel.getProjectById(projectId);

  if (!project) {
    return {
      success: false,
      status: 404,
      message: "Project does not exist",
    };
  }

  const authorizedProject = await taskModel.getProjectByUser(
    projectId,
    userId
  );

  if (!authorizedProject) {
    return {
      success: false,
      status: 403,
      message: "You are not authorized to access this project.",
    };
  }

  const result = await taskModel.getTasksByProject({
    projectId,
    search,
    status,
    priority,
    sortBy,
    order,
    page,
    limit,
  });

  const totalPages = Math.ceil(result.totalTasks / limit);

  return {
    success: true,
    status: 200,
    message: "Tasks fetched successfully",
    data: {
      tasks: result.tasks,
      pagination: {
        page,
        limit,
        totalTasks: result.totalTasks,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  };
};

module.exports = {
    createTask,
    getSingleTask,
    updateTask,
    getTasksByProject,
    deleteTask
}