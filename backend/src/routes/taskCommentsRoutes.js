const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const { createComment } = require("../controllers/taskCommentsController") ;

const router = express.Router();

router.post("/:taskId/comments",authMiddleware,createComment);

module.exports = router 