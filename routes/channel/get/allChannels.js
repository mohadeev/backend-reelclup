import express from "express";
import mongoose from "mongoose";
import channelModal from "../../../db/schema/channel.js";

import User from "../../../db/schema/userModal.js";
import videoModal from "../../../db/schema/video.js";
const allChannels = express.Router();

allChannels.get("/", async (req, res) => {
  const userId = req.userId;
  if (mongoose.Types.ObjectId.isValid(userId)) {
    await User.findOne({ _id: userId }).then(async (docadded) => {
      if (docadded) {
        let allNofy = docadded.notification;
        // console.log("nofication", allNofy.length);
        let allChannels = await channelModal.find(
          { creator: userId },
          {
            _id: 1,
            default: 1,
            "channelData.title": 1,
            "channelData.name": 1,
            "channelData.profileImg.url": 1,
            "channelData.coverImg.url": 1,
            followersCount: { $size: "$followers" },
          }
        );
        const channels = [];
        await Promise.all(
          allChannels.map(async (chnl) => {
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
        channels.sort((a, b) =>
          a.default === b.default ? 0 : a.default ? -1 : 1
        );
        res.json({
          responsData: { notification: allNofy.length, channels: channels },
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

export default allChannels;
