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

const getWorkspaceMembers = async ( { client , workspaceId } ) => {

    const query = `
     SELECT 
          u.id,
          u.name,
          u.email,
          wm.role
     FROM workspace_members wm
     INNER JOIN users u
     ON wm.user_id = u.id
     WHERE wm.workspace_id = $1`

    const values = [ workspaceId ] ;

    const result = await client.query( query , values ) ;

    return result.rows ;
    }



module.exports = {
    addMember,
    getMemberRole,
    getWorkspaceMember,
    getWorkspaceMembers
};
