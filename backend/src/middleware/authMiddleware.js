const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;