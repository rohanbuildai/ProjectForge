const pool = require("../config/db");
const workspaceModel = require("../models/workspace.model");
const workspaceMemberModel = require("../models/workspaceMember.model");
const userModel = require("../models/user.model");

const createWorkspace = async ({ name, description, createdBy }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const workspace = await workspaceModel.createWorkspace({
      client,
      name,
      description,
      createdBy,
    });

    await workspaceMemberModel.addMember({
      client,
      workspaceId: workspace.id,
      userId: createdBy,
      role: "OWNER",
    });

    await client.query("COMMIT");
    return workspace;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Rollback failed:", rollbackError);
    }

    throw error;
  } finally {
    client.release();
  }
};

const getUserWorkspaces = async ({ userId }) => {
  const client = await pool.connect();

  try {
    const workspaces = await workspaceModel.getUserWorkspaces({
      client,
      userId,
    });

    return workspaces;
  } catch (error) {
    console.error(error);

    throw error;
  } finally {
    client.release();
  }
};

const getWorkspaceById = async ({ workspaceId, userId }) => {
  const client = await pool.connect();

  try {
    const workspace = await workspaceModel.getWorkspaceById({
      client,
      workspaceId,
      userId,
    });

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    return workspace;
  } catch (error) {
    console.error(error);

    throw error;
  } finally {
    client.release();
  }
};

const addWorkspaceMember = async ({ userId, workspaceId, email, role }) => {
  const client = await pool.connect();

  try {

    const memberRole = await workspaceMemberModel.getMemberRole({
      client,
      workspaceId,
      userId,
    });

    if ( !memberRole) {
      throw new Error("You are not a member of workspace")
    }

    if ( memberRole.role === "MEMBER" ) {
      throw new Error("You don't have the permission to add members")
    }

    const user = await userModel.getUserByEmail({
      client,
      email,
    })

    if (!user) {
      throw new Error("User does not exist")
    }

    const existingMember = await workspaceMemberModel.getWorkspaceMember({
      client,
      userId : user.id,
      workspaceId
    })

    if ( existingMember ) {
      throw new Error("User already exists as a member")
    }

    const addedMember = await workspaceMemberModel.addMember({
      client,
      workspaceId,
      userId : user.id,
      role
    })

    return addedMember;


  } catch (error) {

    console.error(error);

    throw error;

  } finally {

    client.release();

  }
};

module.exports = {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  addWorkspaceMember
};
