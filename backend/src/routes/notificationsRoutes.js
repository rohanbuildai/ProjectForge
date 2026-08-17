const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createNotification , getNotificationsByUser , getUnreadNotificationsByUser , markNotificationAsRead , markAllNotificationsAsRead } = require("../controllers/notificationsController");

const router = express.Router();

router.post("/",authMiddleware,createNotification) ;
router.get("/",authMiddleware,getNotificationsByUser) ;
router.get("/unread",authMiddleware,getUnreadNotificationsByUser) ;
router.post("/:notificationId/read",authMiddleware,markNotificationAsRead) ;
router.post("/read-all",authMiddleware,markAllNotificationsAsRead) ;

module.exports = router ;