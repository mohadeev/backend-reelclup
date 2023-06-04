import express from "express";
import User from "../../../db/schema/userModal.js";
const submiteVideo = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import videoModal from "../../../db/schema/video.js";
import commentModal from "../../../db/schema/comment.js";
import channelModal from "../../../db/schema/channel.js";

submiteVideo.post("/", async (req, res) => {
  const { videoId, comment } = req.body;
  const userId = req.userId;
  if (mongoose.Types.ObjectId.isValid(videoId)) {
    const channelMadeReq = await channelModal.findOne({
      creator: userId,
      default: true,
    });
    console.log("channelMadeReq", channelMadeReq);
    await videoModal.findOne({ _id: videoId }).then(async (video) => {
      commentModal
        .create({
          channelId: channelMadeReq._id,
          creatore: userId,
          videoId,
          comment,
        })
        .then(async (com) => {
          if (com) {
            let allCom = video.comments;
            allCom.push({ id: com._id });
            const filter = { _id: videoId };
            const update = {
              comments: allCom,
            };
            try {
              await videoModal.updateOne(filter, update);
              const data = {
                commentData: com,
                creatoreData: channelMadeReq.channelData,
              };
              data.commentData.creatore = null;
              // console.log(data);
              res.json({ responseData: data });
            } catch (error) {}
          }
        });
    });
  }
});

export default submiteVideo;
