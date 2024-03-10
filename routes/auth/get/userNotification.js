import express from "express";
import mongoose from "mongoose";
import channelModal from "../../../db/schema/channelModel.js";

import User from "../../../db/schema/userModel.js";
import videoModal from "../../../db/schema/videoModel.js";
const userNotification = express.Router();

userNotification.get("/", async (req, res) => {
  const userId = req.userId;
  if (mongoose.Types.ObjectId.isValid(userId)) {
    await User.findOne({ _id: userId }).then(async (docadded) => {
      if (docadded) {
        let allNofy = [];
        let userNotification = await channelModal.find(
          { creator: userId },
          {
            _id: 1,
            "channelData.title": 1,
            "channelData.name": 1,
            "channelData.profileImg.url": 1,
            followersCount: { $size: "$followers" },
          }
        );
        const channels = [];
        const notification = docadded.notification;
        let videoId;
        await Promise.all(
          notification.map(async (item, index) => {
            videoId = item.from.videoId;
            await videoModal
              .findOne(
                { _id: videoId },
                {
                  channelId: 1,
                  title: 1,
                  _id: 1,
                  thumbnail: 1,
                  duration: 1,
                  createdAt: 1,
                  viewsCount: { $size: "$views" },
                  commentsCount: { $size: "$comments" },
                  location: 1,
                  likesCount: { $size: "$likes" },
                  disLikesCount: { $size: "$disLikes" },
                  isLiked: {
                    $cond: {
                      if: { $in: ["userId", "$likes"] },
                      then: true,
                      else: false,
                    },
                  },
                  isCard: true,
                }
              )
              .then(async (histyVid) => {
                let channelId;
                if (histyVid) {
                  channelId = histyVid.channelId;
                  await channelModal
                    .findOne(
                      { _id: channelId },
                      {
                        _id: 1,
                        "channelData.title": 1,
                        "channelData.name": 1,
                        "channelData.profileImg.url": 1,
                        followersCount: { $size: "$followers" },
                      }
                    )
                    .then(async (channel) => {
                      const data = {
                        index: index,
                        vid: item,
                        channelData: channel,
                        videoData: histyVid,
                      };
                      if (channel) {
                        await allNofy.push(data);
                      }
                    });
                }
              });
          })
        );
        await Promise.all(
          userNotification.map(async (chnl) => {
            if (typeof chnl !== "undefined") {
              const query = {
                channelId: chnl._id,
              };
              const videoLength = await videoModal.countDocuments(query);
              chnl.channelData.numbers = { uploads: videoLength };
              // console.log(chnl.channelData.numbers.uploads);
              await channels.push(chnl);
            }
          })
        );
        allNofy.sort((a, b) => (a.index < b.index ? 1 : -1));
        channels.sort((a, b) =>
          a.default === b.default ? 0 : a.default ? -1 : 1
        );
        res.json({
          responsData: { notification: allNofy, channels: channels },
        });
      } else if (!docadded) {
        res.json({
          message: "EamilNotFinded",
        });
      }
    });
  } else {
  }
});

export default userNotification;
