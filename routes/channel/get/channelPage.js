import express from "express";
import channelModal from "../../../db/schema/channelModel.js";
import mongoose from "mongoose";
import User from "../../../db/schema/userModel.js";
import commentModal from "../../../db/schema/comment.js";
const channelPage = express.Router();
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
// import channelVideos from "./chanelVideos.js";
import videoModal from "../../../db/schema/videoModel.js";

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
channelPage.get("/get/channel/:channelId/:userId", async (req, res) => {
  const userId = req.params.userId;
  await AuthToken(req, userId);
  const userIdReq = req.userId;

  const channelId = req.params.channelId;

  if (channelId && mongoose.Types.ObjectId.isValid(channelId)) {
    const query = {
      channelId: channelId,
    };
    const videoLength = await videoModal.countDocuments(query);
    console.log("videoLength", videoLength);
    await channelModal.findOne({ _id: channelId }).then(async (channel) => {
      if (channel) {
        const channelData = channel;
        const comments = [];
        await Promise.all(
          channelData.community.map(async (com, index) => {
            let comId = com.id;
            if (mongoose.Types.ObjectId.isValid(comId))
              await commentModal
                .findOne({ _id: comId })
                .then(async (commentData) => {
                  await channelModal
                    .findOne({ creator: commentData.creatore })
                    .then(async (channel) => {
                      const data = {
                        commentData: commentData,
                        creatoreData: channel?.channelData,
                      };

                      data.commentData.creatore = null;
                      await comments.push(data);
                    });
                });
          })
        );
        channelData.community = comments;
        let userIsFollowing = channelData?.followers.some(
          ({ id }) => id === `${userIdReq}`
        );

        const folls = channelData.followers.length;
        console.log(channelData.followers);
        channelData.channelData.numbers = {
          uploads: videoLength,
          followers: folls,
        };

        res.json({
          responsData: {
            userData: { isFollowing: userIsFollowing },
            channelData: channelData,
          },
          videoData: [],
        });
      } else if (!channel) {
        res.json({
          message: "EamilNotFinded",
        });
      }
    });
  } else {
    res.end();
  }
});

export default channelPage;
