// import { S3 } from "aws-sdk";
import aws from "aws-sdk";
const { S3 } = aws;
import { v4 as uuidv4 } from "uuid";

const s3UploadVideo = async (buffer, originalname, path, bucketName) => {
  aws.config.update({
    secretAccessKey: "lhNJtS3D55rHQyDoiq7zgHiobP3uAqRU/k2hVFSs",
    accessKeyId: "AKIAUAZXV3IDN6DGCFSC",
    region: process.env.REGION,
  });
  const BUCKET = process.env.REELCLUP_AWS_S3_BUCKET_NAME;
  const s3 = new aws.S3();
  const params = {
    Bucket: BUCKET,
    Key: `${path}/${uuidv4() + originalname}`,
    Body: buffer,
  };
  return await s3.upload(params).promise();
};

export default s3UploadVideo;
