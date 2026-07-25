const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { validateCreateWorkspace } = require("../validations/workspace.validation");
const { createWorkspace , getWorkspaces , getWorkspaceById , addWorkspaceMember , getWorkspaceMembers} = require("../controllers/workspaceController");

const router = express.Router();

router.post("/" , authMiddleware , validateCreateWorkspace , createWorkspace)
router.get("/" , authMiddleware , getWorkspaces)
router.get("/:workspaceId" , authMiddleware , getWorkspaceById)
router.post("/:workspaceId/members",authMiddleware,addWorkspaceMember)
router.get("/:workspaceId/members",authMiddleware,getWorkspaceMembers)


module.exports = router;