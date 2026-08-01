const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createWorkspaceInvitation, acceptWorkspaceInvitation } = require("../controllers/invitationController");

const router = express.Router();

router.post("/:workspaceId/invitations",authMiddleware,createWorkspaceInvitation) ;
router.post("/:token/accept",authMiddleware,acceptWorkspaceInvitation);

module.exports = router