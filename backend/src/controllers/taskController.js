const pool = require("../config/db");
const taskService = require("../services/task.service");

const createTask = async (req, res) => {
    try {
        const { id } = req.user;
        const { workspaceId, projectId } = req.params;

        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo
        } = req.body;

        const result = await taskService.createTask({
            workspaceId: Number(workspaceId),
            projectId: Number(projectId),
            userId: id,
            title,
            description,
            priority,
            dueDate,
            assignedTo
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
        const { id } = req.user;
        const { workspaceId, projectId } = req.params;

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
            workspaceId: Number(workspaceId),
            projectId: Number(projectId),
            userId: id,
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
        const { id } = req.user;
        const { workspaceId, projectId, taskId } = req.params;

        const result = await taskService.getSingleTask({
            workspaceId: Number(workspaceId),
            projectId: Number(projectId),
            taskId: Number(taskId),
            userId: id,
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
        const { id } = req.user;
        const { workspaceId, projectId, taskId } = req.params;

        const {
            title,
            description,
            priority,
            status,
            dueDate,
            assignedTo
        } = req.body;

        const result = await taskService.updateTask({
            workspaceId: Number(workspaceId),
            projectId: Number(projectId),
            taskId: Number(taskId),
            userId: id,
            title,
            description,
            priority,
            status,
            dueDate,
            assignedTo
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

const getTasksByWorkspace = async (req, res) => {
    try {
        const { id } = req.user;
        const { workspaceId } = req.params;

        const {
            search,
            status,
            priority,
            assignedTo,
            sortBy,
            order,
        } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;

        const result = await taskService.getTasksByWorkspace({
            workspaceId: Number(workspaceId),
            userId: id,
            search,
            status,
            priority,
            assignedTo: assignedTo ? Number(assignedTo) : undefined,
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

const deleteTask = async (req, res) => {
    try {
        const { id } = req.user;
        const { workspaceId, projectId, taskId } = req.params;

        const result = await taskService.deleteTask({
            workspaceId: Number(workspaceId),
            projectId: Number(projectId),
            taskId: Number(taskId),
            userId: id,
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
    getTasksByWorkspace,
    deleteTask,
};