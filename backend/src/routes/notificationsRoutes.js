const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createNotification , getNotificationsByUser } = require("../controllers/notificationsController");

const router = express.Router();

router.post("/",authMiddleware,createNotification) ;
router.get("/",authMiddleware,getNotificationsByUser) ;

module.exports = router ;