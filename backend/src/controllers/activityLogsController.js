const activityLogsService = require("../services/activityLogs.service") ;

const createActivityLog = async ( req , res , next ) => {

    const { id } = req.user ;
    const { workspaceId } = req.params ;
    const { action , entityType , entityId , metadata } = req.body ;

    try {

        const activityLog = await activityLogsService.createActivityLog({
            workspaceId , 
            userId : id , 
            action , 
            entityType , 
            entityId , 
            metadata
        })

        return res.status(201).json({
        success: true,
        message: "Activity log created successfully",
        data: activityLog,
        });

    }catch(error) {
        console.log(error) ;

        next(error) ;
    }
}

module.exports = {
    createActivityLog
}