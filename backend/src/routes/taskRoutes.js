const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createTask , getTasksByProject, getSingleTask, updateTask } = require("../controllers/taskController");

const router = express.Router();

router.post("/",authMiddleware,createTask);
router.get("/project/:projectId",authMiddleware,getTasksByProject)
router.get("/:taskId",authMiddleware,getSingleTask)
router.put("/:taskId",authMiddleware,updateTask)

module.exports = router;