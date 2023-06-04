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
import commentModal from "../../../db/schema/comment.js";
import channelModal from "../../../db/schema/channel.js";

submiteVideo.post("/", async (req, res) => {
  const { channelId, comment } = req.body;
  const userId = req.userId;
  if (mongoose.Types.ObjectId.isValid(channelId)) {
    await channelModal.findOne({ _id: channelId }).then(async (mainChannel) => {
      commentModal
        .create({
          creatore: userId,
          channelId,
          comment,
        })
        .then(async (com) => {
          if (com) {
            let allCom = mainChannel.community;
            allCom.push({ id: com._id });
            const filter = { _id: channelId };
            const update = {
              community: allCom,
            };
            try {
              await channelModal.updateOne(filter, update);
              channelModal.findOne(filter, async (error, resuel) => {
                if (resuel) {
                  let deniedTimeIDs = resuel.community;
                  const community = [];
                  await Promise.all(
                    deniedTimeIDs.map(async (com, index) => {
                      let comId = com.id;
                      if (mongoose.Types.ObjectId.isValid(comId))
                        await commentModal
                          .findOne({ _id: comId })
                          .then(async (commentData) => {
                            await channelModal
                              .findOne({ creator: commentData.creatore })
                              .then(async (channel) => {
                                const data = {
                                  index: index,
                                  commentData: commentData,
                                  creatoreData: channel?.channelData,
                                };

                                data.commentData.creatore = null;
                                // data.creatoreData.creator = null;
                                await community.push(data);
                              });
                          });
                    })
                  );
                  deniedTimeIDs = community;
                  const newData = community.sort((a, b) =>
                    a.index > b.index ? 1 : -1
                  );
                  res.json({ responseData: newData });
                }
              });
            } catch (error) {}
          }
        });
    });
  }
});

export default submiteVideo;
