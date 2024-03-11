// import { S3 } from "aws-sdk";
import aws from "aws-sdk";
const { S3 } = aws;
import { v4 as uuidv4 } from "uuid";

const awsDeleteFile = async (Backet, Key) => {
  const BUCKET = process.env.Shaarit_AWS_S3_BUCKET_NAME;
  console.log(BUCKET, BUCKET);
  aws.config.update({
    secretAccessKey: process.env.Shaarit_AWS_S3_PUBLIC_ACCESS_KEY_ID,
    accessKeyId: process.env.Shaarit_AWS_S3_PUBLIC_ACCESS_KEY_ID,
    region: process.env.REGION,
  });
  const s3 = new aws.S3();
  const params = {
    Bucket: BUCKET,
    Key: Key,
  };
  console.log("here");
  s3.deleteObject({ Bucket: BUCKET, Key: Key }, function (err, data) {
    if (err) {
      // Handle the error if the object cannot be deleted
      console.log("Error:", err);
      // return res.status(500).json({ message: "Internal server error" });
    } else {
      // If the object is successfully deleted, return a success response
      console.log("Object deleted");
      // return res.status(200).json({ message: "Object deleted" });
    }
  });
};

export default awsDeleteFile;

// var AWS = require("aws-sdk");

// AWS.config.loadFromPath("./credentials-ehl.json");

// var s3 = new AWS.S3();
// var params = { Bucket: "your bucket", Key: "your object" };
