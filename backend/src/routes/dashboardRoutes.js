const { getDashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");


const express = require("express");
const router = express.Router();


router.get("/", authMiddleware, getDashboard);

module.exports = router;