const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createProject, getProjects } = require("../controllers/projectController");

const router = express.Router();

router.post("/",authMiddleware,createProject)
router.get("/", authMiddleware,getProjects)

module.exports = router;