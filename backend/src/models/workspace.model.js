const pool = require("../config/db");

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

module.exports = {
    createWorkspace
} ;