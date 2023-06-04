import express from "express";
import User from "../../../db/schema/userModal.js";
const renderImages = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import multer from "multer";

const mongoURL = process.env.MONGOCONNECTURL;
const conn = mongoose.createConnection(mongoURL);
let gfs, gridfsBucket;

conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
});

renderImages.get("/get/read/images/:filename", async (req, res) => {
  // try {
  //   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
  //     console;
  //     if (file) {
  //       const readStream = gridfsBucket.openDownloadStream(file._id);
  //       readStream.pipe(res);
  //     } else {
  //       res.status(404).json({
  //         err: "Not an image",
  //       });
  //     }
  //   });
  // } catch (error) {
  // }
});

export default renderImages;
