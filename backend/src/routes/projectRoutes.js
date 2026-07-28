const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createProject, getProjects, getProjectById, updateProject, deleteProject } = require("../controllers/projectController");

const router = express.Router();

router.post("/:workspaceId/projects",authMiddleware,createProject)
router.get("/:workspaceId/projects", authMiddleware,getProjects)
router.get("/:workspaceId/projects/:projectId", authMiddleware,getProjectById)
router.put("/:workspaceId/projects/:projectId", authMiddleware,updateProject)
router.delete("/:workspaceId/projects/:projectId", authMiddleware,deleteProject)

module.exports = router;