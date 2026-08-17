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

const getNotificationsByUser = async ( req , res , next ) => {

    try {

        const { id } = req.user ;

        const notifications = await notificationsService.getNotificationsByUser({
            userId : id
        })

        return res.status(201).json({
            success: true,
            message: "Notifications fetched successfully",
            data : notifications
        });

    }catch (error) {
        console.log(error) ;

        next(error) ;
    }
}

const getUnreadNotificationsByUser = async ( req , res , next ) => {

    try {

        const { id } = req.user ;

        const unreadNotifications = await notificationsService.getUnreadNotificationsByUser({
            userId : id
        })

        return res.status(201).json({
            success: true,
            message: "Unread notifications fetched successfully",
            data : unreadNotifications
        });

    }catch (error) {
        console.log(error) ;

        next(error) ;
    }
}

const markNotificationAsRead = async ( req , res , next ) => {
    
    const { id } = req.user ;
    const { notificationId } = req.params ;

    try {

        const readNotification = await notificationsService.markNotificationAsRead({
        userId : id ,
        notificationId
    })

        return res.status(201).json({
            success: true,
            message: "Notification seen successfully",
            data : readNotification
        });

    }catch (error) {
        console.log(error) ;

        next(error) ;
    }

}

module.exports = {
    createNotification ,
    getNotificationsByUser ,
    getUnreadNotificationsByUser ,
    markNotificationAsRead
}