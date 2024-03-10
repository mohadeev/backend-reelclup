import express from "express";
import userModel from "../../db/schema/userModel.js";
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import videoModel from "../../db/schema/videoModel.js";
import s3UploadVideo from "../../routes/video/post/upload/aws3.js";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import axios from "axios";
import ffmpegPath from "ffmpeg-static"; // Import the ffmpeg-static package

import fs from "fs";
import videoThumbnailGenerator from "../video-thumbnail-generator/videoThumbnailGenerator.js";
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

const videosNoImg = async (req, res) => {
  const query = {
    location: { $exists: true },
    $expr: { $gt: [{ $strLenCP: "$location" }, 1] },
    thumbnail: { $exists: false },
    "thumbnailupload.uplaoded": true,
    "thumbnailupload.finished": true,
    "thumbnailupload.updated": true,
  };
  const count = await videoModel.countDocuments(query);
  if (count >= 1) {
    videoModel
      .find(query)
      .then((files) => {
        if (files.length >= 1) {
          files.map((videoFile) => {
            const id = videoFile._id;
            console.log(videoFile._id);
            const __dirname = path.resolve();
            ffmpeg.setFfmpegPath(ffmpegPath);
            const videoPath = path.join(__dirname, "images", id + ".mp4");
            const filePath = path.join(__dirname, "images");
            const imgPath = path.join(filePath, id + ".jpg");
            const uplaodingAndCreatingFunc = () => {
              ffmpeg(videoPath)
                .size("50%")
                .outputOptions([
                  "-vframes 1",
                  "-q:v 1", // Set the video quality (1 is the best, 31 is the worst)
                  "-preset slow", // Use a slower encoding preset for better quality
                ])
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
                      if (fs.existsSync(videoPath)) {
                        fs.unlinkSync(videoPath);
                      }
                      if (fs.existsSync(imgPath)) {
                        fs.unlinkSync(imgPath);
                      }
                      await videoModel.updateOne(filter, update);
                    } catch (error) {
                      console.error(error);
                    }
                  }
                })
                .on("error", (error) => {
                  console.error("Error during video conversion:", error);
                })
                .run();
            };

            // Check if the video file already exists
            if (fs.existsSync(videoPath)) {
              // console.log("Video file already exists:", videoPath);
              uplaodingAndCreatingFunc();
            } else {
              axios({
                method: "get",
                url: videoFile.location,
                responseType: "stream",
              })
                .then((response) => {
                  response.data
                    .pipe(fs.createWriteStream(videoPath))
                    .on("close", () => {
                      console.log("Video downloaded");
                    });
                })
                .catch((error) => {
                  console.error("Error during video download:", error);
                });
            }
          });
        } else {
          console.log("No videos to process.");
        }
      })
      .catch((error) => {
        console.error("Error querying videos:", error);
      });
  }
};

export default videosNoImg;
