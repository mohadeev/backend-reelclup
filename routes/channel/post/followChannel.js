import express from "express";
import User from "../../../db/schema/userModel.js";
const followChannel = express.Router();
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import mongoose from "mongoose";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import videoModal from "../../../db/schema/videoModel.js";
import channelModal from "../../../db/schema/channelModel.js";

followChannel.post("/", async (req, res) => {
  const channelId = req.body.channelId;
  const isFollowing = req.body.isFollowing;
  const userId = req.userId;
  console.log("channel Id to Follow", channelId);
  if (
    mongoose.Types.ObjectId.isValid(channelId) &&
    mongoose.Types.ObjectId.isValid(userId) &&
    channelId?.length >= 15
  ) {
    try {
      await channelModal.findOne({ _id: channelId }).then(async (channel) => {
        console.log("channel", channel, "finded");
        if (channel) {
          const channelFollowers = channel.followers;
          const inInFollowers = channelFollowers.some(
            ({ id }) => id === userId
          );
          if (!inInFollowers && isFollowing) {
            channelFollowers.push({ id: userId });
            const update = { followers: channelFollowers };
            const filter = { _id: channelId };
            try {
              await channelModal.updateOne(filter, update);
              await channelModal.findOne(filter).then((resuelt) => {
                if (resuelt) {
                  const followers = resuelt.followers.length;
                  res.json({
                    responseData: {
                      followers: followers,
                      followed: true,
                    },
                  });
                }
              });
            } catch (error) {
              res.json({ error: error.message });
            }
          } else if (inInFollowers && channelFollowers.length >= 1) {
            const index = channelFollowers.findIndex(({ id }) => id === userId);
            let dataNew = channelFollowers;
            dataNew = channelFollowers.splice(1, index);
            const update = { followers: dataNew };
            const filter = { _id: channelId };
            try {
              await channelModal.updateOne(filter, update);
              await channelModal.findOne(filter).then((resuelt) => {
                if (resuelt) {
                  const followers = resuelt.followers.length;
                  res.json({
                    responseData: {
                      followers: followers,
                      followed: false,
                    },
                  });
                }
              });
            } catch (error) {
              res.json({ error: error.message });
            }
          } else {
            res.json({ error: "error.message" });
          }
        }
      });
    } catch (error) {
      console.log(error);
      res.json({ error: "error.message" });
    }
  }
});

export default followChannel;
