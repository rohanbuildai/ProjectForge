const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const { createComment, getCommentsByTask , updateTaskComment , deleteTaskComment } = require("../controllers/taskCommentsController") ;

const router = express.Router();

router.post("/:workspaceId/projects/:projectId/tasks/:taskId/comments",authMiddleware,createComment);
router.get("/:workspaceId/projects/:projectId/tasks/:taskId/comments",authMiddleware,getCommentsByTask);
router.patch("/:workspaceId/projects/:projectId/tasks/:taskId/comments/:commentId",authMiddleware,updateTaskComment);
router.delete("/:workspaceId/projects/:projectId/tasks/:taskId/comments/:commentId",authMiddleware,deleteTaskComment);

module.exports = router 