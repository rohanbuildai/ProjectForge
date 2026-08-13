const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/upload");
const { createTaskAttachments , getAttachmentsByTask , deleteTaskAttachment } = require("../controllers/taskAttachmentsController");

const router = express.Router();

router.post("/:workspaceId/projects/:projectId/tasks/:taskId/attachments",authMiddleware,uploadMiddleware.upload.single("file"),createTaskAttachments) ;
router.get("/:workspaceId/projects/:projectId/tasks/:taskId/attachments",authMiddleware,getAttachmentsByTask)
router.delete("/:workspaceId/projects/:projectId/tasks/:taskId/attachments/:attachmentId",authMiddleware,deleteTaskAttachment)

module.exports = router 