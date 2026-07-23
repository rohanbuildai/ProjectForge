const pool = require("../config/db");
const workspaceModel = require("../models/workspace.model");
const workspaceMemberModel = require("../models/workspaceMember.model");

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

module.exports = {
  createWorkspace,
  getUserWorkspaces,
};
