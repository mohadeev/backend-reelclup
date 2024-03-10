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
import removeVideosFromMonogodb from "./removeVideosFromMonogodb.js";
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

const renderVideo = async (req, res) => {
  // await channelModal.find({}).then((chneeeels) => {
  //   chneeeels.map(async (chnnnn) => {
  //     const update = chnnnn;
  //     console.log(update.channelData.profileImg.profileImgUpload);
  //     const mainUploaded = {
  //       id: "",
  //       filename: "",
  //       uplaoded: true,
  //       finished: true,
  //       updated: true,
  //     };
  //     update.channelData.profileImg.profileImgUpload = mainUploaded;
  //     console.log(update.channelData);
  //     console.log(update._id);
  //     try {
  //       console.log("here");
  //       await channelModal.updateOne({ _id: update._id }, update);
  //       console.log("file uplaoded");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });
  // });
  videosNoImg();
  channelCover();
  channelProfilImg();
  const query = {
    "uploaded.uplaoded": true,
    "uploaded.finished": false,
  };
  const countOfVideosNeedToUplaodTAws = await videoModel.countDocuments(query);
  const countOfVideosToRemoveDb = await videoModel.countDocuments({
    "uploaded.uplaoded": true,
    "uploaded.finished": true,
    "uploaded.updated": false,
  });
  const uploadVideoToAws = async () => {
    videoModel
      .find({ "uploaded.uplaoded": true, "uploaded.finished": false })
      .then((files) => {
        if (files.length >= 1) {
          files.map((videoFile) => {
            const videoUpdate = videoFile;
            var objectId = mongoose.Types.ObjectId(videoFile.uploaded.id);
            console.log("objectId", objectId);
            const channelId = videoFile.channelId;
            console.log("video to update", videoFile._id);
            gfs.files.findOne({ _id: objectId }, (err, file) => {
              if (file?._id) {
                var bufferArray = [];
                const readStream = gridfsBucket.openDownloadStream(file?._id);
                readStream.on("data", async (chunk) => {
                  bufferArray.push(chunk);
                });
                readStream.on("end", async () => {
                  var buffer = Buffer.concat(bufferArray);
                  const reslt = await s3UploadVideo(
                    buffer,
                    file.filename,
                    "videos",
                    process.env.AWS_BUCKET_NAME
                  );
                  if (reslt) {
                    await timeHandelr(videoUpdate._id, buffer);
                    const filter = {
                      _id: videoFile._id,
                    };
                    videoUpdate.location = reslt.Location;
                    videoUpdate.uploaded.finished = true;
                    videoUpdate.uploaded.updated = false;
                    videoUpdate.uploaded.fileKey = reslt.Key;
                    await videoModel.updateOne(filter, videoUpdate);
                    videosNoImg();
                  } else {
                    console.log("noe ressuttttt");
                  }
                });
              }
            });
          });
        }
      });
  };

  if (countOfVideosNeedToUplaodTAws >= 1) {
    await uploadVideoToAws();
  }

  if (countOfVideosToRemoveDb >= 1) {
    removeVideosFromMonogodb();
  }
};

export default renderVideo;
