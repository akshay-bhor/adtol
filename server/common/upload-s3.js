const AWS = require('aws-sdk');

const AWS_S3_CREDENTIALS = new AWS.Credentials(process.env.AWS_S3_ACCESS_KEY, process.env.AWS_S3_SECRET_KEY);

const S3 = new AWS.S3({
    apiVersion: "2010-12-01",
    credentials: AWS_S3_CREDENTIALS,
    region: process.env.AWS_REGION,
});

exports.uploadImageS3 = async (imageBuffer, name, contentType) => {
    const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Body: imageBuffer,
        Key: name,
        ContentType: contentType
    }

    return S3.putObject(uploadParams).promise();
}

exports.deleteImageS3 = async (key) => {
    const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key
    }

    return S3.deleteObject(deleteParams).promise();
}