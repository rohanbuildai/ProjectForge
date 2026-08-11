const createComment = async ( { client , taskId , userId , content } ) => {
    
    const query = `
     INSERT INTO task_comments (
        task_id,
        user_id,
        content
        )
        VALUES ($1, $2, $3)
        RETURNING *;`

    const values = [ taskId , userId , content ] ;

    const result = await client.query( query , values ) ;

    return result.rows[0]

}

const getCommentById = async ({ client, commentId }) => {

  const query = `
    SELECT *
    FROM task_comments
    WHERE id = $1;`

  const values = [commentId];

  const result = await client.query(query, values);

  return result.rows[0];
};

const getCommentsByTask = async ( { client, taskId } ) => {

  const query = `
    SELECT
      task_comments.*,
      users.name AS user_name,
      users.email AS user_email
    FROM task_comments
    JOIN users
      ON task_comments.user_id = users.id
    WHERE task_comments.task_id = $1
    ORDER BY task_comments.created_at ASC;`;

  const values = [taskId];

  const result = await client.query(query, values);

  return result.rows;
};

const updateTaskComment = async ( { client, commentId, content } ) => {

  const query = `
    UPDATE task_comments
    SET content = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;`;

  const values = [content, commentId];

  const result = await client.query(query, values);

  return result.rows[0];
};

const deleteTaskComment = async ( { client, commentId } ) => {

  const query = `
    DELETE FROM task_comments
    WHERE id = $1
    RETURNING *;`;

  const values = [commentId];

  const result = await client.query(query, values);

  return result.rows[0];
};

module.exports = {
    createComment,
    getCommentById,
    getCommentsByTask,
    updateTaskComment,
    deleteTaskComment
}