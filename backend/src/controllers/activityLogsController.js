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

const getActivityLogs = async (req, res) => {
    const { id } = req.user;
    const { workspaceId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 50;

    try {
        const result = await activityLogsService.getActivityLogs({
            workspaceId: Number(workspaceId),
            userId: id,
            limit,
        });

        return res.status(result.status).json(result);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    createActivityLog,
    getActivityLogs,
};