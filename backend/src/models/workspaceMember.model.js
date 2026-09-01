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

/* ------------------------------------------------------------------ */
/* Enhanced members list with search, filter, sort, pagination,       */
/* and project/task counts. Used by the Members page.                 */
/* ------------------------------------------------------------------ */

const SORT_COLUMNS = {
    name: "u.name",
    joined: "wm.joined_at",
    role: `CASE wm.role
               WHEN 'OWNER' THEN 0
               WHEN 'ADMIN' THEN 1
               WHEN 'MEMBER' THEN 2
               ELSE 3
           END`,
    projects: "project_count",
    tasks: "task_count",
};

const getWorkspaceMembersDetailed = async ({
    client,
    workspaceId,
    search,
    role,
    sortBy,
    order,
    page,
    limit,
}) => {
    const sortColumn = SORT_COLUMNS[sortBy] || SORT_COLUMNS.name;
    const sortDirection = order === "desc" ? "DESC" : "ASC";
    const offset = (page - 1) * limit;

    /* Build WHERE conditions dynamically */
    const conditions = ["wm.workspace_id = $1"];
    const values = [workspaceId];

    if (search) {
        values.push(`%${search}%`);
        conditions.push(
            `(u.name ILIKE $${values.length} OR u.email ILIKE $${values.length})`
        );
    }

    if (role) {
        values.push(role);
        conditions.push(`wm.role = $${values.length}`);
    }

    const whereClause = conditions.join(" AND ");

    /* Count total matching rows for pagination metadata */
    const countQuery = `
        SELECT COUNT(*)::int AS total
        FROM workspace_members wm
        INNER JOIN users u ON wm.user_id = u.id
        WHERE ${whereClause};
    `;
    const countResult = await client.query(countQuery, values);
    const total = countResult.rows[0].total;

    /* Main query with project/task subqueries */
    const dataQuery = `
        SELECT
            u.id,
            u.name,
            u.email,
            wm.role,
            wm.joined_at,
            (
                SELECT COUNT(DISTINCT t.project_id)::int
                FROM tasks t
                INNER JOIN projects p ON t.project_id = p.id
                WHERE t.assigned_to = u.id
                  AND p.workspace_id = $1
            ) AS project_count,
            (
                SELECT COUNT(*)::int
                FROM tasks t
                INNER JOIN projects p ON t.project_id = p.id
                WHERE t.assigned_to = u.id
                  AND p.workspace_id = $1
            ) AS task_count
        FROM workspace_members wm
        INNER JOIN users u ON wm.user_id = u.id
        WHERE ${whereClause}
        ORDER BY ${sortColumn} ${sortDirection}, u.name ASC
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2};
    `;

    values.push(limit, offset);
    const dataResult = await client.query(dataQuery, values);

    return {
        members: dataResult.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
    };
};

/* ------------------------------------------------------------------ */
/* Aggregate statistics for the Members summary cards.                */
/* ------------------------------------------------------------------ */

const getMemberStatistics = async ({ client, workspaceId }) => {
    const query = `
        SELECT
            COUNT(*)::int AS total_members,
            COUNT(*)::int AS active_members,
            COUNT(*) FILTER (WHERE role = 'OWNER')::int AS owners
        FROM workspace_members
        WHERE workspace_id = $1;
    `;

    const result = await client.query(query, [workspaceId]);
    return result.rows[0];
};

/* ------------------------------------------------------------------ */
/* Count owners — used to prevent removing the last owner.            */
/* ------------------------------------------------------------------ */

const countOwners = async ({ client, workspaceId }) => {
    const query = `
        SELECT COUNT(*)::int AS owner_count
        FROM workspace_members
        WHERE workspace_id = $1
          AND role = 'OWNER';
    `;

    const result = await client.query(query, [workspaceId]);
    return result.rows[0].owner_count;
};

const updateMemberRole = async ( { client , workspaceId , memberId , role } ) => {

    const query = `
    UPDATE workspace_members
    SET role = $1
    WHERE workspace_id = $2
    AND user_id = $3
    RETURNING *;`

    const values = [ role , workspaceId , memberId ] ;

    const result = await client.query( query , values ) ;

    return result.rows[0]
}

const deleteWorkspaceMember = async ( { client , workspaceId , memberId } ) => {
    
    const query = `
    DELETE FROM workspace_members
        WHERE workspace_id = $1
        AND user_id = $2
        RETURNING *`


    const values = [ workspaceId , memberId ] ;

    const result = await client.query( query , values ) ;

    return result.rows[0] ;
    }


module.exports = {
    addMember,
    getMemberRole,
    getWorkspaceMember,
    getWorkspaceMembers,
    getWorkspaceMembersDetailed,
    getMemberStatistics,
    countOwners,
    updateMemberRole,
    deleteWorkspaceMember
};
