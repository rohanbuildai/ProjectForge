const addMember = async ( { client, workspaceId, userId, role } ) => {
  const query = `
     INSERT INTO workspace_members(
             workspace_id,
             user_id,
             role)
     VALUES( $1, $2, $3 )
     RETURNING *;
     `;

  const values = [ workspaceId, userId, role];

  const result = await client.query(query, values);

  return result.rows[0];
};


const getMemberRole = async ({ client, workspaceId, userId }) => {
    const query = `
        SELECT role
        FROM workspace_members
        WHERE workspace_id = $1
        AND user_id = $2;
    `;

    const values = [workspaceId, userId];

    const result = await client.query(query, values);

    return result.rows[0];
};

const getWorkspaceMember = async ( { client, userId, workspaceId } ) => {

    const query = `
     SELECT * 
     FROM workspace_members
     WHERE workspace_id = $1
     AND user_id = $2`

     const values = [ workspaceId , userId]

     const result = await client.query( query , values )

     return result.rows[0]
}


module.exports = {
    addMember,
    getMemberRole,
    getWorkspaceMember
};
