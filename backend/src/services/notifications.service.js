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

const getNotificationsByUser = async ( { userId } ) => {
    const client = await pool.connect() ;

    try {

        if ( !userId ) {
            throw new Error("User does not exist")
        }

        const notifications = await notificationModel.getNotificationsByUser({
            client ,
            userId
        })

        return notifications ;

    }catch (error) {
    throw error;

  } finally {
    client.release();
  }
}

const getUnreadNotificationsByUser = async ( { userId } ) => {
    const client = await pool.connect() ;

    try {

        if ( !userId ) {
            throw new Error("User does not exist")
        }

        const unreadNotifications = await notificationModel.getUnreadNotificationsByUser({
            client ,
            userId
        })

        return {
            unreadCount : unreadNotifications.length ,
            unreadNotifications
        } ;

    }catch (error) {
    throw error;

  } finally {
    client.release();
  }
}

const markNotificationAsRead = async ( { userId , notificationId } ) => {
    const client = await pool.connect() ;

    try{

        if ( !notificationId ) {
            throw new Error("Please enter notification id") ;
        }

        const notification = await notificationModel.getNotificationById({
            client ,
            notificationId
        })

        if ( !notification ) {
            throw new Error("Notification does not exist") ;
        }

        if ( notification.user_id !== userId ) {
            throw new Error("You are not allowed to perform this action") ;
        }

        if ( notification.is_read === true ) {
            throw new Error("The notification is already seen") ;
        }

        const readNotification = await notificationModel.markNotificationAsRead({
            client ,
            notificationId ,
            userId
        })

        return readNotification ;

    }catch (error) {
    throw error;

  } finally {
    client.release();
  }
}

module.exports = {
    createNotification ,
    getNotificationsByUser ,
    getUnreadNotificationsByUser ,
    markNotificationAsRead
}