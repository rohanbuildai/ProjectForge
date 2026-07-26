const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  addWorkspaceMember,
  getWorkspaceMembers,
} = require("../controllers/workspaceMemberController");

const router = express.Router();

router.post(
  "/:workspaceId/members",
  authMiddleware,
  addWorkspaceMember
);

router.get(
  "/:workspaceId/members",
  authMiddleware,
  getWorkspaceMembers
);

module.exports = router;