// import { S3 } from "aws-sdk";
import aws from "aws-sdk";
const { S3 } = aws;
import { v4 as uuidv4 } from "uuid";

const testsFiles = async (Backet, Key) => {
  const BUCKET = process.env.REELCLUP_AWS_S3_BUCKET_NAME;
  console.log(BUCKET, BUCKET);
  aws.config.update({
    secretAccessKey: process.env.REELCLUP_AWS_S3_PUBLIC_ACCESS_KEY_ID,
    accessKeyId: process.env.REELCLUP_AWS_S3_PUBLIC_ACCESS_KEY_ID,
    region: process.env.REGION,
  });
  const s3 = new aws.S3();
  const params = {
    Bucket: BUCKET,
    Key: Key,
  };
  console.log("here");
  // s3.deleteObject(params, function (err, data) {
  //   console.log(data);
  //   if (err) console.log(err, err.stack); // error
  //   else {
  //     console.log("file removed susx");
  //     return data;
  //   }
  // });
  s3.headObject(
    {
      Bucket: BUCKET,
      Key: "videos/ffa90921-37ff-43a3-a883-cc7ee23df70763e51b36109cc9fd9244a43353ee60b89cb0cdc46b3b86e08f913e80.mp4",
    },
    function (err, data) {
      if (err) {
        // Handle the error if the object does not exist
        if (err.code === "NotFound") {
          console.log("Object not found");
          // return res.status(404).json({ message: "Object not found" });
        } else {
          console.log("Error:", err);
          // return res.status(500).json({ message: "Internal server error" });
        }
      } else {
        // If the object exists, return a success response
        console.log("Object found", data);
        s3.getObject(
          {
            Bucket: BUCKET,
            Key: "videos/ffa90921-37ff-43a3-a883-cc7ee23df70763e51b36109cc9fd9244a43353ee60b89cb0cdc46b3b86e08f913e80.mp4",
          },
          function (err, data) {
            if (err) {
              // Handle the error if the object cannot be retrieved
              console.log("Error:", err);
              // return res.status(500).json({ message: "Internal server error" });
            } else {
              // If the object data is successfully retrieved, return a success response with the data
              console.log("Object retrieved");
              const objectData = {
                url: data["@url"], // The URL to access the object
                contentType: data.ContentType, // The MIME type of the object
                contentLength: data.ContentLength, // The size of the object in bytes
                lastModified: data.LastModified, // The timestamp of the object's last modification
                body: data.Body, // The content of the object
              };
              console.log(objectData);
              // return res.status(200).json(objectData);
            }
          }
        );
        // return res.status(200).json({ message: "Object found" });
      }
    }
  );
};

export default testsFiles;
