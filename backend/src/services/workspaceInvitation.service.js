const pool = require("../config/db");
const workspaceModel = require("../models/workspace.model");
const workspaceMemberModel = require("../models/workspaceMember.model");
const workspaceInvitationModel = require("../models/workspaceInvitation.model");
const userModel = require("../models/user.model");
const crypto = require("crypto");

const createWorkspaceInvitation = async ({
  userId,
  workspaceId,
  email,
  role,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const workspace = await workspaceModel.getWorkspaceById({
      client,
      workspaceId,
      userId,
    });

    if (!workspace) {
      throw new Error("Workspace does not exist");
    }

    const memberRole = await workspaceMemberModel.getMemberRole({
      client,
      workspaceId,
      userId,
    });

    if (!memberRole || memberRole.role !== "OWNER") {
      throw new Error("You are not allowed to invite members");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const member = await workspaceInvitationModel.getWorkspaceMemberByEmail({
      client,
      workspaceId,
      email: normalizedEmail,
    });

    if (member) {
      throw new Error("The invited user is already a member");
    }

    const pendingInvitation =
      await workspaceInvitationModel.getPendingInvitation({
        client,
        workspaceId,
        email: normalizedEmail,
      });

    if (pendingInvitation) {
      throw new Error("An invite is already pending for this user");
    }

    const invitationToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(invitationToken)
      .digest("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const allowedRoles = ["ADMIN", "MEMBER"];

    if (!allowedRoles.includes(role)) {
      throw new Error("Invalid workspace role");
    }

    const invitation = await workspaceInvitationModel.createInvitation({
      client,
      workspaceId,
      email: normalizedEmail,
      role,
      tokenHash,
      expiresAt,
      invitedBy: userId,
    });

    await client.query("COMMIT");

    return {
      invitation,
      invitationToken,
    };
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

const acceptWorkspaceInvitation = async ({ userId, token }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const invitation = await workspaceInvitationModel.getInvitationByTokenHash({
      client,
      tokenHash,
    });

    if (!invitation) {
      throw new Error("Invalid invitation.");
    }

    if (invitation.status !== "PENDING") {
      throw new Error("Invitation is no longer valid.");
    }

    if (new Date() > invitation.expires_at) {
      throw new Error("Invitation has expired.");
    }

    const user = await userModel.getUserById({
      client,
      userId,
    });

    if (!user) {
      throw new Error("User not found.");
    }

    if (user.email !== invitation.email) {
      throw new Error("You must be logged in with the invited email address.");
    }

    await workspaceMemberModel.addMember({
      client,
      workspaceId: invitation.workspace_id,
      userId,
      role: invitation.role,
    });

    await workspaceInvitationModel.updateInvitationStatus({
      client,
      invitationId: invitation.id,
      status: "ACCEPTED",
    });

    await client.query("COMMIT");

    return {
      success: true,
      status: 200,
      message: "Invitation accepted successfully.",
    };
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

const getWorkspaceInvitations = async ( { workspaceId , userId } ) => {

  const client = await pool.connect() ;

  try{

    const workspace = await workspaceModel.getWorkspaceById({
      client,
      workspaceId,
      userId
    })

    if ( !workspace ) {
      throw new Error("Workspace does not exist") ;
    }

    const member = await workspaceMemberModel.getWorkspaceMember ({
      client,
      userId,
      workspaceId
    })

    if ( !member ) {
      throw new Error("You are not a member of this  workspace") ;
    }

    const invitations = await workspaceInvitationModel.getWorkspaceInvitations({
      client,
      workspaceId
    })

    return invitations ;

  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  createWorkspaceInvitation,
  acceptWorkspaceInvitation,
  getWorkspaceInvitations
};
