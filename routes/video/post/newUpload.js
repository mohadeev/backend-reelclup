import express from "express";
import User from "../../../db/schema/userModel.js";
const newUpload = express.Router();
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import videoModal from "../../../db/schema/videoModel.js";
import fs from "fs";
import s3UploadVideo from "./upload/aws3.js";
import timeHandelr from "../../../live-funcs/video-handel/timeHandelr.js";
import channelModal from "../../../db/schema/channelModel.js";
const __dirname = path.resolve();

// const storage = multer.memoryStorage();
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
  "/post/video/create-new-video/:token",
  AuthToken,
  upload.single("video"),
  async (req, res) => {
    const channelId = req.body.channelId;
    console.log(
      "is making the req uplaoding now from channel",
      channelId,
      "and user id is",
      req.userId
    );

    console.log("channelId", channelId);
    console.log("uplaoding", "uplaoding");
    if (mongoose.Types.ObjectId.isValid(channelId)) {
      channelModal.findOne({ id: channelId }).then(async (channel) => {
        if (channel.creator === req.userId) {
          const File = req.file;
          fs.readFile(File.path, async (err, buffer) => {
            console.log("buffer", buffer);
            const reslt = await s3UploadVideo(
              buffer,
              File.originalname,
              "videos",
              process.env.REELCLUP_AWS_S3_BUCKET_NAME
            );
            // try {
            //   fs.unlinkSync(path);
            //   //file removed
            // } catch (err) {
            //   console.error(err);
            // }
            if (reslt && reslt.Location) {
              const creatoreId = req.userId;
              await videoModal
                .create({
                  channelId,
                  location: reslt.Location,
                  creatore: creatoreId,
                  filename: File.filename,
                  fileId: File.id,
                })
                .then(async (newFile) => {
                  const update = channel;
                  try {
                    const filter = {
                      _id: channel._id,
                    };

                    update.channelData.numbers.uploads =
                      update.channelData.numbers.uploads + 1;
                    await timeHandelr(newFile._id, File.path);
                    await channelModal.updateOne(filter, update);
                  } catch (error) {}

                  res.json({ file: newFile, uploaded: true });
                });
            }
          });
        }
      });
    }
  }
);

export default newUpload;
