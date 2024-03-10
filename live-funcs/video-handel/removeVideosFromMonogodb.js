import express from "express";
import userModel from "../../db/schema/userModel.js";
// const renderVideo = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import multer from "multer";
import videoModel from "../../db/schema/videoModel.js";
import s3UploadVideo from "../../routes/video/post/upload/aws3.js";
import timeHandelr from "./timeHandelr.js";
import channelModal from "../../db/schema/channelModel.js";
import videosNoImg from "./videosNoImg.js";
import channelCover from "../channel-images/channelCover.js";
import channelProfilImg from "../channel-images/channelProfilImg.js";
import MongodbLink from "../../MongodbLink.js";

const mongoURL = MongodbLink();
const conn = mongoose.createConnection(mongoURL);
let gfs, gridfsBucket;

conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "video",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("video");
});

const removeVideosFromMonogodb = async () => {
  console.log("no videos to update");
  videoModel
    .find({
      "uploaded.uplaoded": true,
      "uploaded.finished": true,
      "uploaded.updated": false,
    })
    .then(async (dataVideo) => {
      if (dataVideo?.length >= 1) {
        console.log(dataVideo.length, "videos to update");
        await Promise.all(
          dataVideo.map((vid) => {
            var vidUploadedId = mongoose.Types.ObjectId(vid.uploaded.id);
            console.log("video id", vidUploadedId);
            gfs.files.deleteOne({ _id: vidUploadedId }, async (err) => {
              if (err) {
                console.log(err);
              } else {
                try {
                  const filter = {
                    _id: vid._id,
                  };
                  vid.uploaded.updated = true;
                  await videoModel.updateOne(filter, vid);
                  console.log("success");
                  return true;
                } catch (error) {}
              }
            });
          })
        );
      } else {
        console.log("video removed");
      }
    });
};

export default removeVideosFromMonogodb;
