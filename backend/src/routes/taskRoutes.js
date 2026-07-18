const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createTask , getTasksByProject } = require("../controllers/taskController");

const router = express.Router();

router.post("/",authMiddleware,createTask);
router.get("/project/:projectId",authMiddleware,getTasksByProject)

module.exports = router;