const { create } = require("axios");
const taskCommentsService = require("../services/taskCommentsService") ;


const createComment = async ( req , res , next ) => {

    const { id } = req.user ;
    const { taskId , workspaceId } = req.params ;
    const  { content } = req.body ;

    try{

        const createTaskComment = await taskCommentsService.createComment({
            workspaceId,
            userId : id,
            taskId,
            content
        })

        return res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: createTaskComment,
        });

    }catch(error) {
        console.error(error)

        next(error)
    }
}

module.exports = {
    createComment
}