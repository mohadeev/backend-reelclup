import express from "express";
import User from "../../../db/schema/userModal.js";
const createNewVideo = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import videoModal from "../../../db/schema/video.js";

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

const storage = new GridFsStorage({
  url: mongoURL,
  file: (req, file) => {
    const channelId = req.body.channelId;
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        } else {
          const filename =
            channelId + buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "video",
          };
          resolve(fileInfo);
        }
      });
    });
  },
});

const upload = multer({ storage });
createNewVideo.post(
  "/post/video/create-new-video/:token",
  AuthToken,
  upload.single("video"),
  async (req, res) => {
    const File = req.file;
    console.log("req is maded but something is happend");
    console.log("file uplaoded", File);
    if (File && !File.contentType.includes("video/")) {
      gfs.files.deleteOne(
        { filename: File.filename, root: "video" },
        (err, gridStore) => {
          if (err) {
            return res.status(404).json({ err: err });
          } else {
            res.json({ message: "ONLYVIDEOS" });
          }
        }
      );
    } else {
      const channelId = req.body.channelId;
      const creatoreId = req.userId;
      await videoModal
        .create({
          channelId,
          creatore: creatoreId,
          filename: File.filename,
          fileId: File.id,
          uploaded: {
            id: File.id,
            filename: File.filename,
            uplaoded: true,
            finished: false,
            updated: false,
          },
        })
        .then((newFile) => {
          console.log(newFile);
          res.json({ file: newFile, uploaded: true });
        });
    }
  }
);

export default createNewVideo;
