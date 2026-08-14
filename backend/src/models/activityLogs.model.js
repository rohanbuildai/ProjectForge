const createActivityLog = async ({
    client,
    workspaceId,
    userId,
    action,
    entityType,
    entityId,
    metadata
}) => {

    const query = `
        INSERT INTO activity_logs (
            workspace_id,
            user_id,
            action,
            entity_type,
            entity_id,
            metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;`;

    const values = [
        workspaceId,
        userId,
        action,
        entityType,
        entityId,
        metadata
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};

module.exports = {
    createActivityLog
}