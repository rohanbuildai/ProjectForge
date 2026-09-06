const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");

const { analyzeProjectController } = require("../../controllers/Ai/aiController");

router.post("/:workspaceId/projects/:projectId/ai/analyze",authMiddleware,analyzeProjectController);

module.exports = router;