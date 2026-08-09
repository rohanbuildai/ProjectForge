const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const { createComment, getCommentsByTask } = require("../controllers/taskCommentsController") ;

const router = express.Router();

router.post("/:workspaceId/projects/:projectId/tasks/:taskId/comments",authMiddleware,createComment);
router.get("/:workspaceId/projects/:projectId/tasks/:taskId/comments",authMiddleware,getCommentsByTask);

module.exports = router 