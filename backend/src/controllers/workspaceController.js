const workspaceService = require("../services/workspace.service");

const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.user;

    const workspace = await workspaceService.createWorkspace({
      name,
      description,
      createdBy: id,
    });

    return res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const { id } = req.user;

    const workspaces = await workspaceService.getUserWorkspaces({
      userId: id,
    });

    return res.status(200).json({
      success: true,
      message: "Workspaces fetched successfully",
      data: workspaces,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getWorkspaceById = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { id } = req.user;

    const workspace = await workspaceService.getWorkspaceById({
      workspaceId,
      userId: id,
    });

    return res.status(200).json({
      success: true,
      message: "Workspace fetched successfully",
      data: workspace,
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Workspace not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const addWorkspaceMember = async (req, res) => {
  try {


    const { id } = req.user;
    const { workspaceId } = req.params;

    const { email, role } = req.body;

    const member = await workspaceService.addWorkspaceMember({
      userId: id,
      workspaceId,
      email,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Member successfully added to workspace",
      data: member,
    });



  } catch (error) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
}


};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  addWorkspaceMember
};
