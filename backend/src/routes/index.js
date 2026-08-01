const express = require("express") ;

const router = express.Router() ;

const { healthCheck } = require("../controllers/healthController");
const authRoutes = require("./authRoutes");
const projectRoutes = require("./projectRoutes");
const taskRoutes = require("./taskRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const workspaceRoutes = require("./workspaceRoutes");
const workspaceMemberRoutes = require("./workspaceMemberRoutes");
const workspaceInvitationRoutes = require("./workspaceInvitationRoutes");


router.get("/health" , healthCheck );
router.use("/auth", authRoutes);
router.use("/workspaces", projectRoutes);
router.use("/workspaces",taskRoutes);
router.use("/workspaces",dashboardRoutes);
router.use("/workspaces",workspaceRoutes);
router.use("/workspaces",workspaceMemberRoutes);
router.use("/workspaces",workspaceInvitationRoutes);
router.use("/invitations",workspaceInvitationRoutes);

module.exports = router;