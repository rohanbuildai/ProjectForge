const crypto = require("crypto");
const pool = require("../config/db");
const workspaceModel = require("../models/workspace.model");
const workspaceMemberModel = require("../models/workspaceMember.model");
const taskModel = require("../models/task.model");
const taskCommentsModel = require("../models/taskComments.model");
const projectModel = require("../models/project.model");
const r2StorageService = require("../services/r2StorageService");
const taskAttachmentsModel = require("../models/taskAttachments.model");


const createTaskAttachments = async ( {  userId , workspaceId , projectId , taskId , file } ) => {
    
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

        const member = await workspaceMemberModel.getWorkspaceMember( { 
            client ,
            userId ,
            workspaceId
        })

        if ( !member ) {
            throw new Error("User is not a member of this workspace");
        }

        const uniqueId = crypto.randomUUID();

        const objectKey = `workspaces/${workspaceId}/tasks/${taskId}/${uniqueId}-${file.originalname}`;

        await r2StorageService.uploadFile({
            buffer: file.buffer,
            objectKey,
            contentType: file.mimetype
        });

        const attachment = await taskAttachmentsModel.createTaskAttachment({
            client,
            taskId,
            uploadedBy: userId,
            fileName: file.originalname,
            objectKey,
            fileType: file.mimetype,
            fileSize: file.size
        });

        return attachment ;

    }catch (error) {
    throw error;

  } finally {
    client.release();
  }
}

module.exports = { 
    createTaskAttachments
}