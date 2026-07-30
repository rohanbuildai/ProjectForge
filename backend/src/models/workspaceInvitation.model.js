const getWorkspaceMemberByEmail = async ({ client, workspaceId, email }) => {
    const query = `
        SELECT
            wm.*
        FROM workspace_members wm
        INNER JOIN users u
            ON wm.user_id = u.id
        WHERE wm.workspace_id = $1
        AND u.email = $2;
    `;      

    const values = [workspaceId, email];

    const result = await client.query(query, values);

    return result.rows[0];
};

const getPendingInvitation = async ({ client, workspaceId, email }) => {
    const query = `
        SELECT *
        FROM workspace_invitations
        WHERE workspace_id = $1
        AND email = $2
        AND status = 'PENDING';
    `;

    const values = [workspaceId, email];

    const result = await client.query(query, values);

    return result.rows[0];
};      

const createInvitation = async ({
    client,
    workspaceId,
    email,
    role,
    tokenHash,
    expiresAt,
    invitedBy
}) => {
    const query = `
        INSERT INTO workspace_invitations (
            workspace_id,
            email,
            role,
            token_hash,
            expires_at,
            invited_by
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const values = [
        workspaceId,
        email,
        role,
        tokenHash,
        expiresAt,
        invitedBy
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};


module.exports = {
    getWorkspaceMemberByEmail,
    getPendingInvitation,
    createInvitation
};