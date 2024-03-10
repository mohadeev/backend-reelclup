import express from "express";
import userModel from "../../db/schema/userModel.js";
// const channelCover = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import multer from "multer";
// import channelModal from "../../db/schema/videoModel.js";
import s3UploadVideo from "../../routes/video/post/upload/aws3.js";

import channelModal from "../../db/schema/channelModel.js";
import videosNoImg from "../video-handel/videosNoImg.js";
import awsDeleteFile from "../../routes/video/post/upload/awsDeleteFile.js";
import MongodbLink from "../../MongodbLink.js";

const mongoURL = MongodbLink();
const conn = mongoose.createConnection(mongoURL);
let gfs, gridfsBucket;

conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
});

const channelCover = async (req, res) => {
  videosNoImg();
  const query = {
    "channelData.coverImg.coverImgImgUpload.uplaoded": true,
    "channelData.coverImg.coverImgImgUpload.finished": false,
  };
  const countOfVideosNeedToUplaodTAws = await channelModal.countDocuments(
    query
  );
  console.log("channel to update", countOfVideosNeedToUplaodTAws);
  const countOfVideosToRemoveDb = await channelModal.countDocuments({
    "channelData.coverImg.coverImgImgUpload.uplaoded": true,
    "channelData.coverImg.coverImgImgUpload.finished": true,
    "channelData.coverImg.coverImgImgUpload.updated": false,
  });
  const uploadVideoToAws = async () => {
    channelModal
      .find({
        "channelData.coverImg.coverImgImgUpload.uplaoded": true,
        "channelData.coverImg.coverImgImgUpload.finished": false,
      })
      .then((files) => {
        if (files.length >= 1) {
          files.map((channelFile) => {
            // console.log(channelFile);
            if (channelFile) {
              console.log("here from file");
              const channelUpdate = channelFile;
              var objectId = mongoose.Types.ObjectId(
                channelFile.channelData.coverImg.coverImgImgUpload.id
              );
              console.log("video to update", channelFile._id);
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
                    "images-nimbatube-channels-profiles",
                    process.env.AWS_BUCKET_NAME
                  );
                  if (reslt) {
                    const fileKey =
                      channelFile.channelData.coverImg.coverImgImgUpload
                        .fileKey;
                    if (fileKey) {
                      const isDleltedIamge = await awsDeleteFile("", fileKey);
                      console.log("fil creatreed", isDleltedIamge);
                    }

                    const filter = {
                      _id: channelFile._id,
                    };
                    console.log(filter);
                    channelUpdate.channelData.coverImg.url = reslt.Location;
                    channelUpdate.channelData.coverImg.coverImgImgUpload.finished = true;
                    channelUpdate.channelData.coverImg.coverImgImgUpload.updated = false;
                    channelUpdate.channelData.coverImg.coverImgImgUpload.fileKey =
                      reslt.Key;
                    console.log(
                      "image updated",
                      channelUpdate.channelData.coverImg.url
                    );
                    await channelModal.updateOne(filter, channelUpdate);
                    await removeVideosFromMonogodb();
                    console.log("updated");
                  } else {
                    console.log("noe ressuttttt");
                  }
                });
              });
            } else {
              console.log("erro");
            }
          });
        }
      });
  };

  const removeVideosFromMonogodb = async () => {
    console.log("no videos to update");
    channelModal
      .find({
        "channelData.coverImg.coverImgImgUpload.uplaoded": true,
        "channelData.coverImg.coverImgImgUpload.finished": true,
        "channelData.coverImg.coverImgImgUpload.updated": false,
      })
      .then(async (dataVideo) => {
        if (dataVideo?.length >= 1) {
          await Promise.all(
            dataVideo.map((vid) => {
              console.log(vid.channelData.coverImg.coverImgImgUpload);
              var vidUploadedId = mongoose.Types.ObjectId(
                vid.channelData.coverImg.coverImgImgUpload.id
              );
              console.log("video id", vidUploadedId);
              gfs.files.deleteOne({ _id: vidUploadedId }, async (err) => {
                if (err) {
                  console.log(err);
                } else {
                  try {
                    const filter = {
                      _id: vid._id,
                    };
                    vid.channelData.coverImg.coverImgImgUpload.updated = true;
                    await channelModal.updateOne(filter, vid);
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

  await uploadVideoToAws();
  await removeVideosFromMonogodb();
  const func = async () => {
    new Promise((resolve, reject) => {
      uploadVideoToAws();
      resolve("susccess");
    });
  };

  const another_func = async () => {
    new Promise((resolve, reject) => {
      removeVideosFromMonogodb();
      resolve("susccess");
    });
  };

  const main = async () => {
    await func();
    await another_func();
  };
  main();
};

export default channelCover;
