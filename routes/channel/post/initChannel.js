import express from "express";
import User from "../../../db/schema/userModal.js";
import channelModal from "../../../db/schema/channel.js";
import uploadChannelImages from "./uploads/uploadChannelImages.js";
import uploadChannelCoverImages from "./uploads/uploadChannelCoverImages.js";
const initChannel = express.Router();

initChannel.post("/", async (req, res) => {
  console.log("creating channel");
  const userId = req.userId;
  await User.findOne({ _id: userId }).then(async (docadded) => {
    channelModal
      .create({
        creator: userId,
      })
      .then((channel) => {
        res.json({ responsData: channel });
      });
  });
});

export default initChannel;
