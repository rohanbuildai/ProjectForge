const { getDashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");


const express = require("express");
const router = express.Router();


router.get("/:workspaceId/dashboard", authMiddleware, getDashboard);

module.exports = router;