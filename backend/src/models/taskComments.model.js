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

module.exports = {
    createComment
}