const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addWorkspaceMember , getWorkspaceMembers , updateMemberRole } = require("../controllers/workspaceMemberController");

const router = express.Router();

router.post("/:workspaceId/members",authMiddleware,addWorkspaceMember);
router.get("/:workspaceId/members",authMiddleware,getWorkspaceMembers);
router.patch("/:workspaceId/members/:memberId",authMiddleware,updateMemberRole);

module.exports = router;