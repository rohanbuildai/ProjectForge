const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/upload");
const { createTaskAttachments } = require("../controllers/taskAttachmentsController");

const router = express.Router();

router.post("/:workspaceId/projects/:projectId/tasks/:taskId/attachments",authMiddleware,uploadMiddleware.upload.single("file"),createTaskAttachments) ;

module.exports = router 