import express from "express";
import chanelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/userModal.js";
const deleteChannel = express.Router();

deleteChannel.post("/", async (req, res) => {
  const { channelId } = req.body;
  const userId = req.userId;
  await User.findOne({ _id: userId }).then(async (docadded) => {
    if (docadded) {
      try {
        await chanelModal
          .findByIdAndRemove({ _id: channelId })
          .then(async (delted) => {
            await chanelModal.find({ creator: userId }).then((channels) => {
              if (channels.length) {
                res.json({ responsData: channels });
              } else {
                res.json({ responsMessage: "NoChanelFounded" });
              }
            });
          });
      } catch (error) {
        return null;
      }
    } else if (!docadded) {
      res.json({
        message: "EamilNotFinded",
      });
    }
  });
});

export default deleteChannel;
