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
import cloudinaryMain from "../../../utils/cloudinary/cloudinaryMain.js";
import uuid4 from "uuid4";

// import cloudinaryMain from "../../../utils/Cloudinary/cloudinaryMain.js";
// import cloudinaryMain from "../../../utils/cloudinary/cloudinaryMain.js";
// import tourModal from "../../../db/schema/tourModal.js";
// import cloudinary from "../../../utils/cloudinary/cloudinaryMain.js";
var id = uuid4();

const __dirname = path.resolve();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "./uploads"));
  },

  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    // console.log(fileExtension);
    cb(null, id + "." + fileExtension);
  },
});
const upload = multer({ storage });

createNewVideo.post(
  "/post/video/create-new-video/:token",
  AuthToken,
  upload.single("video"),
  async (req, res) => {
    const body = req.body;
    const channelId = body.channelId;
    const File = req.file;
    const filePath = File.path;
    if (File && File.mimetype.includes("video/")) {
      const channelId = req.body.channelId;
      const creatoreId = req.userId;
      await videoModal
        .create({
          channelId,
          creatore: creatoreId,
          location: File.filename,
          title: "first video ",
          descreption: "first video ",

          // fileId: File.id,

          // uploaded: {
          //   id: File.id,
          //   filename: File.filename,
          //   uplaoded: true,
          //   finished: false,
          //   updated: false,
          // },
        })
        .then((newFile) => {
          console.log(newFile);
          res.json({ file: newFile, uploaded: true });
        });
    } else {
    }
  }
);

export default createNewVideo;
