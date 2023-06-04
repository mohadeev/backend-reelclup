import express from "express";
import mongoose from "mongoose";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/userModal.js";
const makeDefaultChannel = express.Router();
makeDefaultChannel.post("/", async (req, res) => {
  const { channelId } = req.body;
  console.log("deleting a channel");
  const userId = req.userId;
  await User.findOne({ _id: userId }).then(async (docadded) => {
    console.log(docadded?.username);
    var objectId = mongoose.Types.ObjectId(channelId);
    console.log("channelId", objectId);
    if (docadded) {
      await channelModal
        .findOne({ creator: userId, id: channelId })
        .then(async (channelFinded) => {
          if (channelFinded && channelFinded.creator === userId) {
            try {
              await channelModal.updateOne(
                { default: true },
                { default: false }
              );
              await channelModal.updateOne(
                { _id: objectId },
                { default: true }
              );
              channelModal.find({ creator: userId }).then((chnls) => {
                console.log(chnls);
                const channelsArray = chnls.sort((a, b) =>
                  a.default === b.default ? 0 : a.default ? -1 : 1
                );
                res.json({ responsData: channelsArray });
              });
              //console.log("channel maded as default ");
            } catch (error) {
              return null;
            }
          }
        });
    } else if (!docadded) {
      res.json({
        message: "EamilNotFinded",
      });
    }
  });
});

export default makeDefaultChannel;
