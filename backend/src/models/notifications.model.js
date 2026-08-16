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

module.exports = {
    createNotification ,
    getNotificationsByUser ,
    getUnreadNotificationsByUser
};