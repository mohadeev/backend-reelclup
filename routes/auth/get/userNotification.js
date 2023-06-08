import express from "express";
import mongoose from "mongoose";
import channelModal from "../../../db/schema/channel.js";

import User from "../../../db/schema/userModal.js";
import videoModal from "../../../db/schema/video.js";
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
            default: 1,
            "channelData.title": 1,
            "channelData.name": 1,
            "channelData.profileImg.url": 1,
            followers: 1,
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
                      }
                    )
                    .then(async (channel) => {
                      const data = {
                        index: index,
                        vid: item,
                        channelData: channel,
                        videoData: histyVid,
                      };
                      await allNofy.push(data);
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
              console.log(chnl.channelData.numbers.uploads);
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