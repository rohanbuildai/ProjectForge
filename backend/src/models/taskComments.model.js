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


module.exports = {
    createComment,
    getCommentsByTask
}