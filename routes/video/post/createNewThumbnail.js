import express from "express";
const newUpload = express.Router();
import fs from "fs";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import channelModal from "../../../db/schema/channel.js";
import videoModal from "../../../db/schema/video.js";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import s3UploadVideo from "./upload/aws3.js";
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import crypto from "crypto";
const __dirname = path.resolve();

// const mongoURL = process.env.MONGOCONNECTURL;
// const conn = mongoose.createConnection(mongoURL);
// let gfs, gridfsBucket;
// conn.once("open", () => {
//   gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
//     bucketName: "images",
//   });
//   gfs = Grid(conn.db, mongoose.mongo);
//   gfs.collection("images");
// });
// const storage = new GridFsStorage({
//   url: mongoURL,
//   file: (req, file) => {
//     const channelId = req.body.channelId;
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         } else {
//           const filename =
//             channelId + buf.toString("hex") + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: "images",
//           };
//           resolve(fileInfo);
//         }
//       });
//     });
//   },
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "./uploads"));
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

newUpload.post(
  "/post/video/create-new-thumbnail/:token",
  AuthToken,
  upload.single("thumbnail"),
  async (req, res) => {
    console.log("file");
    const File = req.file;
    const contentType = File.mimetype;
    const videoData = req.body.videoId;
    if (contentType.includes("image")) {
      if (mongoose.Types.ObjectId.isValid(videoData)) {
        videoModal.findOne({ _id: videoData }).then(async (videoDataId) => {
          if (videoDataId) {
            const File = req.file;
            fs.readFile(File.path, async (err, buffer) => {
              console.log("buffer", buffer);
              const reslt = await s3UploadVideo(
                buffer,
                File.originalname,
                "video-thumbnail",
                process.env.AWS_BUCKET_NAME
              );
              const filter = { _id: videoData };
              const update = videoDataId;

              try {
                update.thumbnailupload = {
                  id: File.id,
                  fileKey: reslt.Key,
                  // filename: File.filename,
                  // uplaoded: true,
                  // finished: false,
                  // updated: false,
                };
                update.thumbnail = reslt.Location;
                console.log("reslt", reslt);
                if (videoDataId) {
                  await videoModal.updateOne(filter, update);
                  const dataFile = await videoModal.findOne(filter);
                  res.json({ file: dataFile, uploaded: true });
                }
              } catch (error) {}
            });
          }
        });
      } else {
        res.json({ uplaod: false, error: "NOT-IMAGE" });
      }
    } else console.log("nonee image upload");
  }
);

export default newUpload;
