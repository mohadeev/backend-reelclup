import express from "express";
const newUpload = express.Router();
import fs from "fs";
import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import path from "path";
import channelModal from "../../../../db/schema/channel.js";
import videoModal from "../../../../db/schema/video.js";
import AuthToken from "../../../../utils/verify-user/VerifyUser.js";
import s3UploadVideo from "../../../video/post/upload/aws3.js";
import Grid from "gridfs-stream";
import crypto from "crypto";
///post/channel/channel-profile-image/:token
const mongoURL = process.env.MONGOCONNECTURL;
// const conn = mongoose.createConnection(mongoURL);
let gfs, gridfsBucket;
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

// const upload = multer({ storage });
newUpload.post(
  "/post/channel/channel-profile-image/:token",
  AuthToken,
  // upload.single("thumbnail"),
  async (req, res) => {
    const File = req.file;
    const contentType = File.mimetype;

    if (File && contentType.includes("image/")) {
      const channelId = req.body.channelId;

      if (mongoose.Types.ObjectId.isValid(channelId)) {
        const objChannelId = mongoose.Types.ObjectId(channelId);
        await channelModal.findOne({ _id: channelId }).then(async (channel) => {
          if (channel.creator === req.userId) {
            const filter = { _id: channel._id };
            const update = channel.toObject();
            const mainUploaded = {
              id: File.id,
              filename: File.filename,
              uplaoded: true,
              finished: false,
              updated: false,
            };

            update.channelData.profileImg.profileImgUpload = {};
            update.channelData.profileImg.profileImgUpload = mainUploaded;
            try {
              await channelModal.updateOne(filter, update);
              res.json({ file: "dataFile", uplaoded: true });
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
    } else {
      res.json({ uplaod: false, error: "NOT-IMAGE" });
    }
  }
);

export default newUpload;
