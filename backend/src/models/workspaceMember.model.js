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

module.exports = {
    addMember
};
