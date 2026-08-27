const pool = require("../config/db");

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

const getActivityLogs = async ({
    workspaceId,
    limit = 50,
}) => {
    const query = `
        SELECT
            al.id,
            al.workspace_id,
            al.user_id,
            u.name AS user_name,
            al.action,
            al.entity_type,
            al.entity_id,
            al.metadata,
            al.created_at
        FROM activity_logs al
        LEFT JOIN users u
            ON al.user_id = u.id
        WHERE al.workspace_id = $1
        ORDER BY al.created_at DESC
        LIMIT $2;`;

    const result = await pool.query(query, [workspaceId, limit]);

    return result.rows;
};

module.exports = {
    createActivityLog,
    getActivityLogs,
};