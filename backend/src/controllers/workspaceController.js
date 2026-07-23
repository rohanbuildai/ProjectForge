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
      userId : id,
    });

    return res.status(200).json({
      success: true,
      message: "Workspaces fetched successfully",
      data: workspaces,
    });
  } 
  
  
  
  catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

};

module.exports = {
  createWorkspace,
  getWorkspaces
};
