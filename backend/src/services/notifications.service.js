const pool = require("../config/db");
const workspaceModel = require("../models/workspace.model");
const workspaceMemberModel = require("../models/workspaceMember.model");
const taskModel = require("../models/task.model");
const projectModel = require("../models/project.model");
const notificationModel = require("../models/notifications.model");
const userModel = require("../models/user.model");

const createNotification = async ( { 
    userId,
    type,
    title,
    message,
    entityType,
    entityId,
    metadata
}) => {

    const client = await pool.connect() ;

    try {

        if ( !userId ) {
            throw new Error("User ID is required")
        }

        if ( !type ) {
            throw new Error("Please enter the type")
        }

        if ( !title ) {
            throw new Error("Please enter the title")
        }

        if ( !message ) {
            throw new Error("Please enter the message")
        }

        const user = await userModel.getUserById({
            client,
            userId
        });

        if (!user) {
            throw new Error("User does not exist");
        }

        const notification = await notificationModel.createNotification({
            client,
            userId,
            type,
            title,
            message,
            entityType,
            entityId,
            metadata
        })

        return notification ;

    }catch (error) {
    throw error;

  } finally {
    client.release();
  }
}

module.exports = {
    createNotification
}