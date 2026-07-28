const pool = require("../config/db");
const workspaceModel = require("../models/workspace.model");

const createWorkspace = async ({ client, name, description, createdBy }) => {
    const query = `
        INSERT INTO workspaces (
            name,
            description,
            created_by
        )
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const values = [
        name,
        description,
        createdBy
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};


const getUserWorkspaces = async ( { client , userId } ) => {

    const query = `
     SELECT
        w.id,
        w.name,
        w.description,
        wm.role,
        w.created_at
     FROM workspaces w
     INNER JOIN workspace_members wm
     ON w.id = wm.workspace_id
     WHERE wm.user_id = $1 ;
     `

     const values = [ userId ]

     const result = await client.query ( query , values )

     return result.rows
}


const getWorkspaceById = async ( { client , workspaceId , userId } ) => {
    const query = `
        SELECT
            w.id,
            w.name,
            w.description,
            w.created_at,
            wm.role
        FROM workspaces w
        INNER JOIN workspace_members wm
            ON w.id = wm.workspace_id
        WHERE w.id = $1
        AND wm.user_id = $2;
    `;

    const values = [ workspaceId , userId ] ;

    const result = await client.query(query, values);

    return result.rows[0];
};

const updateWorkspace = async ( { client , workspaceId , updates } ) => {

    const fields = [] ;
    const values = [] ;

    if ( updates.name !== undefined ) {
        fields.push(`name = $${values.length + 1}`);
        values.push(updates.name) ;
    }

    if ( updates.description !== undefined ) {
        fields.push(`description = $${values.length + 1}`) ;
        values.push(updates.description) ;
    }

    values.push(workspaceId) ;

    const query = `
     UPDATE workspaces
     SET ${fields.join(", ")}
     WHERE id = $${values.length}
     RETURNING *`;

    const result = await client.query(query, values);

    return result.rows[0];
}

module.exports = {
    createWorkspace ,
    getUserWorkspaces ,
    getWorkspaceById,
    updateWorkspace
} ;