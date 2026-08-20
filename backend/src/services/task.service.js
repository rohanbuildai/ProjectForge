const pool = require("../config/db");
const taskModel = require("../models/task.model");
const workspaceMemberModel = require("../models/workspaceMember.model");
const notificationService = require("../services/notifications.service");

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

const createTask = async ({
  workspaceId,
  userId,
  projectId,
  title,
  description,
  priority,
  dueDate,
  assignedTo
}) => {
  const client = await pool.connect();

  try {
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

    const accessError = await verifyWorkspaceAccess(workspaceId, userId);

    if (accessError) return accessError;

    const project = await taskModel.getProjectByWorkspace({
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

    if (assignedTo !== undefined && assignedTo !== null) {
    const assignee = await workspaceMemberModel.getWorkspaceMember({
        client,
        workspaceId,
        userId: assignedTo,
    });

    if (!assignee) {
        return {
            success: false,
            status: 400,
            message: "Selected user is not a member of this workspace.",
        };
    }
}

    const task = await taskModel.createTask({
      projectId,
      title: normalizedTitle,
      description,
      priority,
      dueDate,
      assignedTo
    });

    return {
      success: true,
      status: 201,
      message: "Task created successfully",
      data: task,
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};

const getSingleTask = async ({ workspaceId, projectId, taskId, userId }) => {
  const client = await pool.connect();

  try {
    if (!Number.isInteger(taskId) || taskId <= 0) {
      return {
        success: false,
        status: 400,
        message: "Enter valid input",
      };
    }

    const accessError = await verifyWorkspaceAccess(workspaceId, userId);

    if (accessError) return accessError;

    const project = await taskModel.getProjectByWorkspace({
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

    const task = await taskModel.getTaskById({
      taskId,
    });

    if (!task || task.project_id !== projectId) {
      return {
        success: false,
        status: 404,
        message: "Task not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Task fetched successfully",
      data: task,
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};

const updateTask = async ({
  workspaceId,
  projectId,
  taskId,
  userId,
  title,
  description,
  priority,
  status,
  dueDate,
  assignedTo,
}) => {
  const client = await pool.connect();

  try {
    const validPriorities = ["low", "medium", "high"];
    const validStatus = ["todo", "in_progress", "completed"];

    const accessError = await verifyWorkspaceAccess(workspaceId, userId);

    if (accessError) return accessError;

    if (
      title === undefined &&
      description === undefined &&
      priority === undefined &&
      status === undefined &&
      dueDate === undefined &&
      assignedTo === undefined
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

    const project = await taskModel.getProjectByWorkspace({
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

    if (assignedTo !== undefined) {

    if (assignedTo !== null) {

        const assignee = await workspaceMemberModel.getWorkspaceMember({
            client,
            workspaceId,
            userId: assignedTo,
        });

        if (!assignee) {
            return {
                success: false,
                status: 400,
                message: "Selected user is not a member of this workspace.",
            };
        }
    }
}
    


    const task = await taskModel.getTaskById({
      taskId,
    });

    if (!task || task.project_id !== projectId) {
      return {
        success: false,
        status: 404,
        message: "Task not found",
      };
    }

    const updateAssignee = assignedTo !== undefined;

    const updatedTask = await taskModel.updateTask({
      taskId,
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      updateAssignee
    });

    if ( 
      status !== undefined &&
      task.status !== updatedTask.status &&
      task.assigned_to &&
      Number(task.assigned_to) !== Number(userId)
    ) {

      await notificationService.createNotification({
        userId: task.assigned_to,
        type: "TASK_STATUS_CHANGED",
        title: "Task status updated",
        message: `The status of your task "${updatedTask.title}" was changed to ${updatedTask.status}.`,
        entityType: "Task",
        entityId: taskId,
        metadata: {
          taskTitle: updatedTask.title,
          projectId,
          oldStatus: task.status,
          newStatus: updatedTask.status
    }
  });
    }

    if (
      assignedTo !== undefined &&
      assignedTo !== null &&
      Number(task.assigned_to) !== Number(assignedTo)
    ) {

      await notificationService.createNotification({
        userId : assignedTo,
        type : "TASK_ASSIGNED",
        title : "New task assigned",
        message : `You have been assigned the task "${updatedTask.title}"`,
        entityType : "Task",
        entityId : taskId,
        metadata : {
          taskTitle : updatedTask.title ,
          projectId
        }
      })

    }

    return {
      success: true,
      status: 200,
      message: "Task updated successfully.",
      data: updatedTask,
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};

const deleteTask = async ({ workspaceId, projectId, taskId, userId }) => {
  const client = await pool.connect();

  try {
    const accessError = await verifyWorkspaceAccess(workspaceId, userId);

    if (accessError) return accessError;

    const project = await taskModel.getProjectByWorkspace({
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

    const task = await taskModel.getTaskById({
      taskId,
    });

    if (!task || task.project_id !== projectId) {
      return {
        success: false,
        status: 404,
        message: "Task not found",
      };
    }

    const deletedTask = await taskModel.deleteTask({
      taskId,
    });

    return {
      success: true,
      status: 200,
      message: "Task deleted successfully.",
      data: deletedTask,
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};

const getTasksByProject = async ({
  workspaceId,
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
  const client = await pool.connect();

  try {
    if (!Number.isInteger(projectId) || projectId <= 0) {
      return {
        success: false,
        status: 400,
        message: "Enter valid input",
      };
    }

    const accessError = await verifyWorkspaceAccess(workspaceId, userId);

    if (accessError) return accessError;

    const project = await taskModel.getProjectByWorkspace({
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
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};
module.exports = {
  createTask,
  getSingleTask,
  updateTask,
  getTasksByProject,
  deleteTask,
};
