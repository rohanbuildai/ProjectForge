const r2 = require("../config/r2");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const uploadFile = async ({ buffer, objectKey, contentType }) => {

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: objectKey,
        Body: buffer,
        ContentType: contentType,
    });

    await r2.send(command);

    return objectKey;
};

module.exports = {
    uploadFile,
};