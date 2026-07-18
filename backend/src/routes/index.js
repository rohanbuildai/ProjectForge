const express = require("express") ;

const router = express.Router() ;

const { healthCheck } = require("../controllers/healthController");
const authRoutes = require("./authRoutes");
const projectRoutes = require("./projectRoutes");
const taskRoutes = require("./taskRoutes");


router.get("/health" , healthCheck );
router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks",taskRoutes);

module.exports = router;