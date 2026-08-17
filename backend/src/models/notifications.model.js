const createNotification = async ({
    client,
    userId,
    type,
    title,
    message,
    entityType,
    entityId,
    metadata
}) => {

    const query = `
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            entity_type,
            entity_id,
            metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;`;

    const values = [
        userId,
        type,
        title,
        message,
        entityType,
        entityId,
        metadata
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};

const getNotificationsByUser = async ( { client, userId } ) => {

    const query = `
        SELECT *
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC;`;

    const values = [userId];

    const result = await client.query(query, values);

    return result.rows;
};

const getNotificationById = async ( { client , notificationId } ) => {

    const query = `
     SELECT * FROM 
     notifications WHERE
     id = $1;`;

     const values = [ notificationId ] ;

     const result = await client.query( query , values ) ;

     return result.rows[0] ;
}

const getUnreadNotificationsByUser = async ( { client, userId } ) => {

    const query = `
        SELECT *
        FROM notifications
        WHERE user_id = $1
        AND is_read = FALSE
        ORDER BY created_at DESC;`;

    const values = [userId];

    const result = await client.query(query, values);

    return result.rows ;
};

const markNotificationAsRead = async ({
    client,
    notificationId,
    userId
}) => {

    const query = `
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = $1
        AND user_id = $2
        RETURNING *;
    `;

    const values = [
        notificationId,
        userId
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};

module.exports = {
    createNotification ,
    getNotificationsByUser ,
    getNotificationById ,
    getUnreadNotificationsByUser ,
    markNotificationAsRead
};