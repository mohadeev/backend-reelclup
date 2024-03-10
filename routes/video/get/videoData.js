import express from "express";
import mongoose from "mongoose";
import channelModal from "../../../db/schema/channelModel.js";
import User from "../../../db/schema/userModel.js";
const videoData = express.Router();
import videoModal from "../../../db/schema/videoModel.js";
import https from "http";
import axios from "axios";
import jwt from "jsonwebtoken";
import commentModal from "../../../db/schema/comment.js";
import * as cookie from "cookie";

const AuthToken = async (req, reqParamsToken) => {
  if (
    typeof reqParamsToken !== "undefined" &&
    reqParamsToken !== "undefined" &&
    reqParamsToken.length > 20
  ) {
    const CookiesParsed = cookie.parse(reqParamsToken);
    const User = CookiesParsed.user;

    if (typeof User !== "undefined") {
      const userTokken = JSON.parse(User);
      const accesToken = userTokken.accessToken;

      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
      jwt.verify(accesToken, accessTokenSecret, function (err, decoded) {
        if (!err) {
          req.userId = decoded;
          return decoded;
        } else if (err) {
        }
      });
    } else {
      return null;
    }
  }
};

videoData.get("/get/video/:videoId/:unique_id/:userId", async (req, res) => {
  const userId = req.params.userId;
  await AuthToken(req, userId);
  const reqUserId = req.userId;
  const unique_id = req.params.unique_id;
  const videoId = req.params.videoId;
  if (mongoose.Types.ObjectId.isValid(videoId)) {
    let savedToWatchLater = false;
    let savedToFavorites = false;
    if (reqUserId) {
      await User.findOne({ _id: reqUserId }).then(async (userData) => {
        if (userData) {
          const findLargeCity = (element) => {
            return element.id === videoId;
          };
          savedToFavorites = userData.favorites.some(findLargeCity);
          savedToWatchLater = userData.watchLater.some(findLargeCity);

          const allHistroy = await userData.videoHistory;
          const Index = allHistroy.findIndex(({ id }) => id === videoId);
          const Some = allHistroy[allHistroy.length - 1]?.id;

          if (allHistroy.length <= 0) {
            try {
              const udpate = {
                videoHistory: [...allHistroy, { id: videoId }],
              };
              await User.updateOne({ _id: reqUserId }, udpate);
            } catch (error) {}
          } else if (Some !== videoId) {
            try {
              const udpate = {
                videoHistory: [...allHistroy, { id: videoId }],
              };
              await User.updateOne({ _id: reqUserId }, udpate);
            } catch (error) {}
          }
        }
      });
    }
    //HERE
    videoModal.findOne({ _id: videoId }).then(async (video) => {
      // console.log("video-data", video);
      if (video) {
        const views = video?.views;
        const filter = { _id: videoId };
        let update = { views: [...views, { id: unique_id }] };

        try {
          await videoModal.updateOne(filter, update);
        } catch (error) {}
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
                    if (
                      mongoose.Types.ObjectId.isValid(commentData.channelId)
                    ) {
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
  } else {
    res.json({ errorMessage: "video-not-founded" });
  }
});

export default videoData;
