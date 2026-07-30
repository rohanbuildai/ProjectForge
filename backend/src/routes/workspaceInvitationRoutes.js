const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createWorkspaceInvitation } = require("../controllers/invitationController");

const router = express.Router();

router.post("/:workspaceId/invitations",authMiddleware,createWorkspaceInvitation) ;

module.exports = router