const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { 
    createWorkspaceInvitation,
    acceptWorkspaceInvitation, 
    getWorkspaceInvitations, 
    rejectWorkspaceInvitation,
    revokeWorkspaceInvitation
                        } = require("../controllers/invitationController");

const router = express.Router();

router.post("/:workspaceId/invitations",authMiddleware,createWorkspaceInvitation) ;
router.get("/:workspaceId/invitations",authMiddleware,getWorkspaceInvitations);
router.post("/:token/accept",authMiddleware,acceptWorkspaceInvitation);
router.post("/:token/reject",authMiddleware,rejectWorkspaceInvitation);
router.post("/:invitationId/revoke",authMiddleware,revokeWorkspaceInvitation);

module.exports = router