const notificationsService = require("../services/notifications.service");

const createNotification = async ( req , res , next ) => {

    const { id } = req.user;

    const {
        type,
        title,
        message,
        entityType,
        entityId,
        metadata
    } = req.body;

    try {

        const notification =
            await notificationsService.createNotification({
                userId : id,
                type,
                title,
                message,
                entityType,
                entityId,
                metadata
            });

        return res.status(201).json({
            success: true,
            message: "Notification created successfully",
            data : notification
        });

    } catch (error) {
        console.log(error) ;

        next(error) ;
    }
};

module.exports = {
    createNotification
}