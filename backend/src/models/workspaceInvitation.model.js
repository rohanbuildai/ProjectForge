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

const getInvitationByTokenHash = async ({ client, tokenHash }) => {
    const query = `
        SELECT *
        FROM workspace_invitations
        WHERE token_hash = $1;
    `;

    const values = [tokenHash];

    const result = await client.query(query, values);

    return result.rows[0];
};

const updateInvitationStatus = async ({
    client,
    invitationId,
    status
}) => {
    const query = `
        UPDATE workspace_invitations
        SET
            status = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
    `;

    const values = [status, invitationId];

    const result = await client.query(query, values);

    return result.rows[0];
};

const getWorkspaceInvitations = async ( { client , workspaceId } ) => {

    const query = `
    SELECT
    id,
    email,
    role,
    status,
    expires_at,
    invited_by,
    created_at
    FROM workspace_invitations
    WHERE workspace_id = $1
    AND status = 'PENDING'
    ORDER BY created_at DESC;`

    const values = [ workspaceId ] ;

    const result = await client.query( query , values ) ;

    return result.rows ;
}


module.exports = {
    getWorkspaceMemberByEmail,
    getPendingInvitation,
    createInvitation,
    getInvitationByTokenHash,
    updateInvitationStatus,
    getWorkspaceInvitations
};