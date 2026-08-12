const taskAttachmentsService = require("../services/taskAttachments.service") ;

const createTaskAttachments = async (req , res , next ) => {

    const { id } = req.user;

    const { workspaceId, projectId, taskId } = req.params;

    const { file } = req;

    try {

        const result = await taskAttachmentsService.createTaskAttachments({
            userId: id,
            workspaceId,
            projectId,
            taskId,
            file
        });

        return res.status(201).json({
        success: true,
        message: "Attachment created successfully",
        data: result,
        });

    } catch (error) {
        console.log(error);

        next(error)
    }
};

module.exports = { 
    createTaskAttachments
}