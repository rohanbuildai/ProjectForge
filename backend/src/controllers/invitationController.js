const workspaceInvitationService = require("../services/workspaceInvitation.service");

const createWorkspaceInvitation = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    const { id } = req.user;

    const result = await workspaceInvitationService.createWorkspaceInvitation({
      userId: id,
      workspaceId,
      email,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Invitation created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const acceptWorkspaceInvitation = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { id } = req.user;

    const result = await workspaceInvitationService.acceptWorkspaceInvitation({
      userId: id,
      token,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    next(error);
  }
};

const getWorkspaceInvitations = async (req, res) => {
  try {
    const { id } = req.user;
    const { workspaceId } = req.params;

    const invitations =
      await workspaceInvitationService.getWorkspaceInvitations({
        workspaceId,
        userId: id,
      });

    return res.status(200).json({
      success: true,
      message: "Invitation fetched successfully",
      data: invitations,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createWorkspaceInvitation,
  acceptWorkspaceInvitation,
  getWorkspaceInvitations,
};
