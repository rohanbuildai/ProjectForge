const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createTask , getTasksByProject, getSingleTask, updateTask, deleteTask, getTasksByWorkspace } = require("../controllers/taskController");

const router = express.Router();

router.post("/:workspaceId/projects/:projectId/tasks",authMiddleware,createTask);
router.get("/:workspaceId/projects/:projectId/tasks",authMiddleware,getTasksByProject)
router.get("/:workspaceId/projects/:projectId/tasks/:taskId",authMiddleware,getSingleTask)
router.put("/:workspaceId/projects/:projectId/tasks/:taskId",authMiddleware,updateTask)
router.delete("/:workspaceId/projects/:projectId/tasks/:taskId",authMiddleware,deleteTask)
router.get("/:workspaceId/tasks",authMiddleware,getTasksByWorkspace)

module.exports = router;