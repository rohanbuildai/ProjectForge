const dashboardService = require("../services/dashboard.service");

const getDashboard = async (req, res) => {
  try {
    const result = await dashboardService.getDashboard(req.user.id);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getDashboard,
};