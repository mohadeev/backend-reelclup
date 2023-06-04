import express from "express";
import User from "../../db/schema/userModal.js";
// const videosNoImg = express.Router();
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import videoModal from "../../db/schema/video.js";
import s3UploadVideo from "../../routes/video/post/upload/aws3.js";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import axios from "axios";
import ffmpegPath from "ffmpeg-static"; // Import the ffmpeg-static package

import fs from "fs";
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

const videosNoImg = async (req, res) => {
  const query = {
    location: { $exists: true },
    $expr: { $gt: [{ $strLenCP: "$location" }, 1] },
    thumbnail: { $exists: false },
    "thumbnailupload.uplaoded": true,
    "thumbnailupload.finished": true,
    "thumbnailupload.updated": true,
  };
  const count = await videoModal.countDocuments(query);
  if (count >= 1) {
    videoModal
      .find({
        location: { $exists: true },
        $expr: { $gt: [{ $strLenCP: "$location" }, 1] },
        thumbnail: { $exists: false },
        "thumbnailupload.uplaoded": true,
        "thumbnailupload.finished": true,
        "thumbnailupload.updated": true,
      })
      .then((files) => {
        if (files.length >= 1) {
          files.map((videoFile) => {
            const id = videoFile._id;
            console.log(videoFile._id);
            const __dirname = path.resolve();
            ffmpeg.setFfmpegPath(ffmpegPath);
            const videoPath = __dirname + "/images/" + id + ".mp4";
            const filePath = __dirname + "/" + "images";
            const imgPath = filePath + "/" + id + ".jpg";
            const videoUrl = videoFile.location;
            axios({
              method: "get",
              url: videoUrl,
              responseType: "stream",
            })
              .then((response) => {
                response.data
                  .pipe(fs.createWriteStream(videoPath))
                  .on("close", () => {
                    console.log("Video downloaded");
                    ffmpeg(videoPath)
                      .size("30%")
                      .outputOptions("-vframes 1")
                      .output(imgPath)
                      .on("end", async () => {
                        const update = videoFile;
                        const buffer = fs.readFileSync(imgPath);
                        const filter = { _id: update._id };
                        const reslt = await s3UploadVideo(
                          buffer,
                          id + ".jpg",
                          "video-thumbnail",
                          process.env.AWS_BUCKET_NAME
                        );
                        if (reslt.Location) {
                          try {
                            update.thumbnailupload = {
                              id: reslt.ETag,
                              fileKey: reslt.Key,
                            };
                            update.thumbnail = reslt.Location;
                            fs.unlinkSync(imgPath);
                            fs.unlinkSync(videoPath);
                            await videoModal.updateOne(filter, update);
                          } catch (error) {}
                        }
                      })
                      .on("error", (error) => {
                        console.error(error);
                      })
                      .run();
                  });
              })
              .catch((error) => {
                console.error(error);
              });
          });
        } else {
          console.log("no videos");
        }
      });
  }
};

export default videosNoImg;
