const express = require("express");

const router = express.Router();

const { registerUser , loginUser, getCurrentUser, refreshAccessToken, logoutUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register" , registerUser)
router.post("/login" , loginUser)
router.post("/refresh-token",refreshAccessToken)
router.post("/logout", logoutUser)
router.get("/me",authMiddleware,getCurrentUser)

module.exports=router