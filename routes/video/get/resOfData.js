import express from "express";
import mongoose from "mongoose";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/userModal.js";
const videoData = express.Router();
import videoModal from "../../../db/schema/video.js";
import https from "http";
import axios from "axios";
import jwt from "jsonwebtoken";
import commentModal from "../../../db/schema/comment.js";
import * as cookie from "cookie";

videoData.get("/get/video-details/:videoId/:unique_id/:userId", async (req, res) => {
  videoModal.findOne({ _id: videoId }).then(async (video) => {
    if (video) {
      let likes = video.likes;
      let disLikes = video.disLikes;
      let isLiked = likes.some(({ id }) => id === reqUserId);
      let isDisLiked = disLikes.some(({ id }) => id === reqUserId);
      if (video) {
        let resuelData = JSON.stringify([video]);
        var videoData = JSON.parse(resuelData);
        let comId;
        await Promise.all(
          videoData.map(async (items) => {
            items.likes = { liked: isLiked, likes: likes.length };

            items.disLikes = {
              isDisLiked: isDisLiked,
              disLikes: disLikes.length,
            };
          })
        );
        const comments = [];
        await Promise.all(
          videoData[0].comments.map(async (com, index) => {
            let comId = com.id;
            if (mongoose.Types.ObjectId.isValid(comId))
              await commentModal
                .findOne({ _id: comId })
                .then(async (commentData) => {
                  if (mongoose.Types.ObjectId.isValid(commentData.channelId)) {
                    await channelModal
                      .findOne({ _id: commentData.channelId })
                      .then(async (channel) => {
                        const data = {
                          commentData: commentData,
                          creatoreData: channel?.channelData,
                        };
                        data.commentData.creatore = null;
                        // data.creatoreData.creator = null;
                        await comments.push(data);
                      });
                  } else {
                    const data = {
                      commentData: commentData,
                      creatoreData: {},
                    };
                    data.commentData.creatore = null;
                    // data.creatoreData.creator = null;
                    await comments.push(data);
                  }
                });
          })
        );
        videoData[0].comments = comments;
        channelModal
          .findById({ _id: video.channelId })
          .then(async (channel) => {
            let channelDataJSON = JSON.stringify([channel]);
            var channelData = JSON.parse(channelDataJSON);
            const inInFollowers = channel.followers.some(
              ({ id }) => id === reqUserId
            );
            channelData.map((item) => {
              item.followers = {
                followers: channel.followers.length,
                followed: inInFollowers,
              };
            });

            res.json({
              videoData: videoData[0],
              channelData: channelData[0],
              library: {
                savedToWatchLater,
                savedToFavorites,
              },
              getting: unique_id,
            });
          });
      }
    } else {
      res.json({ errorMessage: "video-not-founded" });
    }
  });
});

export default videoData;
