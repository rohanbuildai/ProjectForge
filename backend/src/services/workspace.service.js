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

const updateWorkspace = async ({ workspaceId, userId, updates }) => {
  const client = await pool.connect();
  try {
    const doWorkspaceExist = await workspaceModel.getWorkspaceById({
      client,
      workspaceId,
      userId,
    });

    if (!doWorkspaceExist) {
      throw new Error("Workspace does not exist");
    }

    if (doWorkspaceExist.role !== "OWNER") {
      throw new Error("You are not authorized to perform that action");
    }

    const hasName = updates.name !== undefined;
    const hasDescription = updates.description !== undefined;

    if (!hasName && !hasDescription) {
      throw new Error("At least one field must be provided");
    }

    const normalizedUpdates = {
      ...updates,
    };

    if (normalizedUpdates.name !== undefined) {
      normalizedUpdates.name = normalizedUpdates.name.trim();
    }

    if (normalizedUpdates.description !== undefined) {
      normalizedUpdates.description = normalizedUpdates.description.trim();
    }

    if (normalizedUpdates.name !== undefined && normalizedUpdates.name.length === 0) {
      throw new Error("Workspace name cannot be empty");
    }

    let hasChanges = false;

    if (normalizedUpdates.name !== undefined && normalizedUpdates.name !== doWorkspaceExist.name) {
      hasChanges = true;
    }

    if (
      normalizedUpdates.description !== undefined &&
      normalizedUpdates.description !== doWorkspaceExist.description
    ) {
      hasChanges = true;
    }

    if (!hasChanges) {
      throw new Error("No changes detected");
    }
    const updatedWorkspace = await workspaceModel.updateWorkspace({
      client,
      workspaceId,
      updates : normalizedUpdates,
    });

    return updatedWorkspace;
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
  updateWorkspace
};
