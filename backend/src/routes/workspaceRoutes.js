const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { validateCreateWorkspace } = require("../validations/workspace.validation");
const { createWorkspace , getWorkspaces } = require("../controllers/workspaceController");

const router = express.Router();

router.post("/" , authMiddleware , validateCreateWorkspace , createWorkspace)
router.get("/" , authMiddleware , getWorkspaces)

module.exports = router;