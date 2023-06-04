import mongoose from "mongoose";
import Grid from "gridfs-stream";

const mongoURL = process.env.MONGOCONNECTURL;
const conn = mongoose.createConnection(mongoURL);
export let gfs, gridfsBucket;

const gridConnection = () => {
  conn.once("open", () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "uploads",
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads", "dsd");
  });
};

export default gridConnection;
