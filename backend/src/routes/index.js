const express = require("express") ;

const router = express.Router() ;

const { healthCheck } = require("../controllers/healthController");
const authRoutes = require("./authRoutes");
const projectRoutes = require("./projectRoutes");
const taskRoutes = require("./taskRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const workspaceRoutes = require("./workspaceRoutes");
const workspaceMemberRoutes = require("./workspaceMemberRoutes");


router.get("/health" , healthCheck );
router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks",taskRoutes);
router.use("/dashboard",dashboardRoutes);
router.use("/workspaces",workspaceRoutes);
router.use("/workspaces",workspaceMemberRoutes);

module.exports = router;