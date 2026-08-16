const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createNotification , getNotificationsByUser , getUnreadNotificationsByUser } = require("../controllers/notificationsController");

const router = express.Router();

router.post("/",authMiddleware,createNotification) ;
router.get("/",authMiddleware,getNotificationsByUser) ;
router.get("/unread",authMiddleware,getUnreadNotificationsByUser) ;

module.exports = router ;