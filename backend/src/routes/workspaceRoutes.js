const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { validateCreateWorkspace } = require("../validations/workspace.validation");
const { createWorkspace , getWorkspaces , getWorkspaceById , updateWorkspace } = require("../controllers/workspaceController");

const router = express.Router();

router.post("/" , authMiddleware , validateCreateWorkspace , createWorkspace)
router.get("/" , authMiddleware , getWorkspaces)
router.get("/:workspaceId" , authMiddleware , getWorkspaceById)
router.patch("/:workspaceId" , authMiddleware , updateWorkspace)

module.exports = router;