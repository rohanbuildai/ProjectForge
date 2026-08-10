const pool = require("../config/db");
const workspaceModel = require("../models/workspace.model");
const workspaceMemberModel = require("../models/workspaceMember.model");
const taskModel = require("../models/task.model");
const taskCommentsModel = require("../models/taskComments.model");
const projectModel = require("../models/project.model");

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


const getCommentsByTask = async ( { taskId , userId , workspaceId , projectId } ) => {
    const client = await pool.connect() ;

    try {

        const workspace = await workspaceModel.getWorkspaceById({
            client,
            workspaceId,
            userId
        })

        if ( !workspace ) {
            throw new Error("Workspace does not exist") ;
        }

        const project = await projectModel.getProjectById({
            projectId,
            workspaceId
        })

        if ( !project ) {
            throw new Error("Project does not exist") ;
        }

        const task = await taskModel.getTaskById({
            taskId
        });

        if (!task) {
            throw new Error("Task does not exist");
        }

        if (Number(task.project_id) !== Number(projectId)) {
            throw new Error("Task does not belong to this project");
        }

        const workspaceMember = await workspaceMemberModel.getWorkspaceMember({
            client,
            userId,
            workspaceId
        })

        if ( !workspaceMember ) {
            throw new Error("You are not a member of this workspace") ;
        }

        const comments = await taskCommentsModel.getCommentsByTask({
            client,
            taskId
        })

        return comments ;

    }catch (error) {
    throw error;

  } finally {
    client.release();
  }
}

const updateTaskComment = async ( { userId , commentId , workspaceId , projectId , taskId , content } ) => {
    const client = await pool.connect() ;

    try {

        const workspace = await workspaceModel.getWorkspaceById({
            client,
            workspaceId,
            userId
        })

        if ( !workspace ) {
            throw new Error("Workspace does not exist") ;
        }

        const project = await projectModel.getProjectById({
            projectId,
            workspaceId
        })

        if ( !project ) {
            throw new Error("Project does not exist") ;
        }

        const task = await taskModel.getTaskById({
            taskId
        });

        if (!task) {
            throw new Error("Task does not exist");
        }

        if (Number(task.project_id) !== Number(projectId)) {
            throw new Error("Task does not belong to this project");
        }

        const comment = await taskCommentsModel.getCommentById({
            client,
            commentId
        })

        if ( !comment ) {
            throw new Error("Comment does not exist")
        }

        if (comment.task_id !== taskId) {
            throw new Error("Comment does not belong to this task");
        }

        if (Number(comment.user_id) !== Number(userId)) {
            throw new Error("You are not allowed to update this comment");
        }

        const updatedTaskComment = await taskCommentsModel.updateTaskComment({
            client,
            commentId,
            content
        })

        return updatedTaskComment ;

    }catch (error) {
    throw error;

  } finally {
    client.release();
  }
}


module.exports = {
    createComment,
    getCommentsByTask,
    updateTaskComment
} 