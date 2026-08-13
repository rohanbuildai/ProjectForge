const createTaskAttachment = async ({
    client,
    taskId,
    uploadedBy,
    fileName,
    objectKey,
    fileType,
    fileSize
}) => {

    const query = `
        INSERT INTO task_attachments (
            task_id,
            uploaded_by,
            file_name,
            object_key,
            file_type,
            file_size
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;`;

    const values = [
        taskId,
        uploadedBy,
        fileName,
        objectKey,
        fileType,
        fileSize
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};

const getTaskAttachmentById = async ( { client, attachmentId } ) => {

    const query = `
        SELECT *
        FROM task_attachments
        WHERE id = $1;`;

    const values = [attachmentId];

    const result = await client.query(query, values);

    return result.rows[0];
};

const getAttachmentsByTask = async ({ client, taskId }) => {

    const query = `
        SELECT *
        FROM task_attachments
        WHERE task_id = $1
        ORDER BY created_at ASC;`;

    const values = [taskId];

    const result = await client.query(query, values);

    return result.rows;
};

module.exports = { 
    createTaskAttachment ,
    getTaskAttachmentById ,
    getAttachmentsByTask
}