const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { validateCreateWorkspace } = require("../validations/workspace.validation");
const { createWorkspace , getWorkspaces , getWorkspaceById } = require("../controllers/workspaceController");

const router = express.Router();

router.post("/" , authMiddleware , validateCreateWorkspace , createWorkspace)
router.get("/" , authMiddleware , getWorkspaces)
router.get("/:workspaceId" , authMiddleware , getWorkspaceById)
router.post("/:workspaceId/members",authMiddleware,)

module.exports = router;