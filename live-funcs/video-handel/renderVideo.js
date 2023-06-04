import express from "express";
import User from "../../db/schema/userModal.js";
// const renderVideo = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import multer from "multer";
import videoModal from "../../db/schema/video.js";
import s3UploadVideo from "../../routes/video/post/upload/aws3.js";
import timeHandelr from "./timeHandelr.js";
import channelModal from "../../db/schema/channel.js";
import videosNoImg from "../videos-no-img/videosNoImg.js";
import channelCover from "../channel-images/channelCover.js";
import channelProfilImg from "../channel-images/channelProfilImg.js";

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
  const countOfVideosNeedToUplaodTAws = await videoModal.countDocuments(query);
  const countOfVideosToRemoveDb = await videoModal.countDocuments({
    "uploaded.uplaoded": true,
    "uploaded.finished": true,
    "uploaded.updated": false,
  });
  const uploadVideoToAws = async () => {
    videoModal
      .find({ "uploaded.uplaoded": true, "uploaded.finished": false })
      .then((files) => {
        if (files.length >= 1) {
          files.map((videoFile) => {
            const videoUpdate = videoFile;
            var objectId = mongoose.Types.ObjectId(videoFile.uploaded.id);
            const channelId = videoFile.channelId;
            console.log("video to update", videoFile._id);
            gfs.files.findOne({ _id: objectId }, (err, file) => {
              var bufferArray = [];
              const readStream = gridfsBucket.openDownloadStream(file._id);
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
                  await videoModal.updateOne(filter, videoUpdate);
                } else {
                  console.log("noe ressuttttt");
                }
              });
            });
          });
        }
      });
  };

  const removeVideosFromMonogodb = async () => {
    console.log("no videos to update");
    videoModal
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
                    await videoModal.updateOne(filter, vid);
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

  if (countOfVideosNeedToUplaodTAws >= 1) {
    await uploadVideoToAws();
  }

  if (countOfVideosToRemoveDb >= 1) {
    removeVideosFromMonogodb();
  }
};

export default renderVideo;
