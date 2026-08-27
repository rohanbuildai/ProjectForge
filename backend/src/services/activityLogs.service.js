const pool = require("../config/db");
const workspaceModel = require("../models/workspace.model");
const workspaceMemberModel = require("../models/workspaceMember.model");
const activityLogsModel = require("../models/activityLogs.model");


const createActivityLog = async ( { 
    workspaceId , 
    userId , 
    action , 
    entityType , 
    entityId , 
    metadata } ) => {

    const client = await pool.connect() ;

    try {

        const workspace = await workspaceModel.getWorkspaceById({
            client ,
            workspaceId ,
            userId
        })

        if ( !workspace ) {
            throw new Error("Workspace does not exist") ;
        }

        const member = await workspaceMemberModel.getWorkspaceMember({
            client ,
            userId ,
            workspaceId
        })

        if ( !member ) {
            throw new Error("You are not a member of this workspace") ;
        }

        if (!action) {
            throw new Error("Activity action is required");
        }

        if (!entityType) {
            throw new Error("Entity type is required");
        }

        if (!entityId) {
            throw new Error("Entity ID is required");
        }

        const activityLog = await activityLogsModel.createActivityLog({
            client ,
            workspaceId , 
            userId , 
            action , 
            entityType , 
            entityId , 
            metadata
        })

        return activityLog ;

    }catch (error) {
    throw error;

  } finally {
    client.release();
  }
}

const getActivityLogs = async ({ workspaceId, userId, limit }) => {
    const client = await pool.connect();

    try {
        const member = await workspaceMemberModel.getWorkspaceMember({
            client,
            userId,
            workspaceId,
        });

        if (!member) {
            return {
                success: false,
                status: 403,
                message: "You do not have access to this workspace.",
            };
        }

        const logs = await activityLogsModel.getActivityLogs({
            workspaceId,
            limit,
        });

        return {
            success: true,
            status: 200,
            message: "Activity logs fetched successfully",
            data: logs,
        };
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    createActivityLog,
    getActivityLogs,
}