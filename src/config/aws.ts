export default {
    s3: {
        bucket: process.env.AWS_BUCKET,
        region: process.env.AWS_BUCKET_REGION,
    },
    ses: {
        region: process.env.AWS_SES_REGION,
    },
};
