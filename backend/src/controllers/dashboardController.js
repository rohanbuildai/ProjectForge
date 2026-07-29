const dashboardService = require("../services/dashboard.service");

const getDashboard = async (req, res) => {
  try {
    const { id } = req.user;
    const { workspaceId } = req.params;
    const result = await dashboardService.getDashboard({
      userId : id,
      workspaceId
    });

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