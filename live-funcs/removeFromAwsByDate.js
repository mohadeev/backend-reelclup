import AWS from "aws-sdk";

// Set your AWS credentials and region
const BUCKET = process.env.AWS_BUCKET_NAME;

// AWS.config.update({
//   secretAccessKey: "DYtvFURtonk9hr+kR9koV9XW81pU3X3Ga4EOUb9T",
//   accessKeyId: "AKIAZH6RLFVA32VWXIQE",
//   region: process.env.REGION,
// });

const s3 = new AWS.S3();

// Specify your bucket name
const deleteBeforeDate = new Date("2023-09-28T00:00:00Z");

async function removeFromAwsByDate() {
  try {
    // List all objects in the bucket
    const listObjectsParams = { Bucket: BUCKET };
    const objects = await s3.listObjectsV2(listObjectsParams).promise();

    // Filter objects based on upload date
    const objectsToDelete = objects.Contents.filter((object) => {
      return object.LastModified < deleteBeforeDate;
    });

    // Delete each object
    const deleteObjectPromises = objectsToDelete.map((object) => {
      const deleteParams = { Bucket: BUCKET, Key: object.Key };
      return s3.deleteObject(deleteParams).promise();
    });

    await Promise.all(deleteObjectPromises);

    console.log(`Deleted ${objectsToDelete.length} objects.`);
  } catch (error) {
    console.error("Error deleting objects:", error);
  }
}

// Call the function to delete objects
export default removeFromAwsByDate;
