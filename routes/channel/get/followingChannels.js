import express from "express";
import chanelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/userModal.js";
const followingChannels = express.Router();
followingChannels.get("/", async (req, res) => {
  const userId = req.userId;
  await User.findOne({ _id: userId }).then((docadded) => {
    if (docadded) {
      chanelModal
        .find(
          {
            followers: { $elemMatch: { id: userId } },
          },
          {
            _id: 1,
            "channelData.title": 1,
            "channelData.name": 1,
            "channelData.profileImg.url": 1,
            "channelData.coverImg.url": 1,
            followersCount: { $size: "$followers" },
          }
        )
        .then((channels) => {
          if (channels.length) {
            const allChannels = channels;
            const resChannel = [];
            allChannels.map((item) => {
              resChannel.push(item);
            });
            res.json({ responseData: resChannel });
          } else {
            res.json({ responsMessage: "NoChanelFounded" });
          }
        });
    } else if (!docadded) {
      res.json({
        message: "EamilNotFinded",
      });
    }
  });
});

export default followingChannels;
