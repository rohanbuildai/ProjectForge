const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createActivityLog } = require("../controllers/activityLogsController") ;

const router = express.Router();

router.post("/:workspaceId/activity-logs",authMiddleware,createActivityLog) ;

module.exports = router 
