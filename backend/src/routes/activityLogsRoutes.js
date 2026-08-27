const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createActivityLog, getActivityLogs } = require("../controllers/activityLogsController") ;

const router = express.Router();

router.post("/:workspaceId/activity-logs",authMiddleware,createActivityLog) ;
router.get("/:workspaceId/activity-logs",authMiddleware,getActivityLogs) ;

module.exports = router 
