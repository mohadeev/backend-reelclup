import express from "express";
import User from "../../../db/schema/userModel.js";
// const renderVideo = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import multer from "multer";
import videoModal from "../../../db/schema/videoModel.js";
import s3UploadVideo from "../post/upload/aws3.js";
import timeHandelr from "../post/timeHandelr.js";

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

const renderVideo = async (req, res) => {
  videoModal
    .find({
      "uploaded.uplaoded": true,
      "uploaded.finished": true,
      "uploaded.updated": true,
    })
    .then((files) => {
      if (files.length >= 1) {
        console.log(files, files.length, "all-files");
        files.map((videoFile) => {
          var objectId = mongoose.Types.ObjectId(videoFile.uploaded.id);
          const channelId = videoFile.channelId;
          console.log(videoFile.location);

          gfs.files.findOne({ _id: objectId }, (err, file) => {
            // console.log(file);
            var bufferArray = [];
            const readStream = gridfsBucket.openDownloadStream(file._id);
            readStream.on("data", async (chunk) => {
              // console.log(chunk);
              bufferArray.push(chunk);
            });
            readStream.on("end", async () => {
              var buffer = Buffer.concat(bufferArray);
              const reslt = await s3UploadVideo(
                buffer,
                file.filename,
                "videos",
                process.env.REELCLUP_AWS_S3_BUCKET_NAME
              );
              console.log("reslt", reslt);
              if (reslt) {
                try {
                  const filter = {
                    _id: videoFile._id,
                  };
                  videoFile.location = reslt.Location;
                  videoFile.uploaded.finished = true;
                  videoFile.uploaded.updated = false;
                  await timeHandelr(videoFile._id, videoFile.location);
                  await videoModal.updateOne(filter, videoFile);
                } catch (error) {}
              }

              console.log(buffer, "finish");
            });
          });
        });
      } else {
        // .then((videos) => {
        //   console.log(videos);
        // });
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
      }
    });
};

export default renderVideo;
