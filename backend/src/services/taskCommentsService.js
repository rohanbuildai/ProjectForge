const pool = require("../config/db");
const workspaceModel = require("../models/workspace.model");
const workspaceMemberModel = require("../models/workspaceMember.model");
const taskModel = require("../models/task.model");
const taskCommentsModel = require("../models/taskComments.model");

const createComment = async ( { workspaceId , userId , taskId , content } ) => {
    const client = await pool.connect() ;

    try{

        const task = await taskModel.getTaskById({
            taskId
        })

        if ( !task ) {
            throw new Error("Task doesn't exist") ;
        }

        const member = await workspaceMemberModel.getWorkspaceMember({
            client,
            userId,
            workspaceId
        })

        if ( !member ) {
            throw new Error("you are not a member of that workspace") ;
        }

        const comment = await taskCommentsModel.createComment({
            client,
            taskId,
            userId,
            content
        })

        return comment ;

    }catch (error) {
    throw error;

  } finally {
    client.release();
  }

}


module.exports = {
    createComment
}