const express = require("express") ;

const router = express.Router() ;

const { healthCheck } = require("../controllers/healthController");
const authRoutes = require("./authRoutes");


router.get("/health" , healthCheck );
router.use("/auth", authRoutes)

module.exports = router;