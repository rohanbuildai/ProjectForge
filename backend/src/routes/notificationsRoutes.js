const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createNotification } = require("../controllers/notificationsController");

const router = express.Router();

router.post("/",authMiddleware,createNotification) ;

module.exports = router ;