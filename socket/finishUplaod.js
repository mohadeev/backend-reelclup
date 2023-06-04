import express from "express";
// const finishUplaod = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import multer from "multer";
import videoModal from "../db/schema/video.js";
import channelModal from "../db/schema/channel.js";
import s3UploadVideo from "../routes/video/post/upload/aws3.js";
import timeHandelr from "../live-funcs/video-handel/timeHandelr.js";
import renderVideo from "../live-funcs/video-handel/renderVideo.js";

const mongoURL = process.env.MONGOCONNECTURL;
const conn = mongoose.createConnection(mongoURL);
let gfs, gridfsBucket;

conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "video",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("video");
});

const finishUplaod = (io, socket) => {
  socket.on("finish-uplaod", () => {
    console.log("main from socket");
    renderVideo();
  });
};
export default finishUplaod;
