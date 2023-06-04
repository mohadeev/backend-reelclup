import express from "express";
import User from "../../../db/schema/userModal.js";
import channelModal from "../../../db/schema/channel.js";
import uploadChannelImages from "./uploads/uploadChannelImages.js";
import uploadChannelCoverImages from "./uploads/uploadChannelCoverImages.js";
import mongoose from "mongoose";
const createNewChannel = express.Router();

createNewChannel.post("/", async (req, res) => {
  const userId = req.userId;
  const { general, other } = req.body;
  const { title, name, description } = general;
  const { website, email } = other;
  const channelId = req.body.channelId;

  const { tags } = req.body;
  const walletId = general?.walletId;
  console.log(req.body);
  await User.findOne({ _id: userId }).then(async (docadded) => {
    //console.log(docadded, "channel founeded");
    if (mongoose.Types.ObjectId.isValid(channelId)) {
      //console.log("channel founeded 2");
      if (typeof docadded !== "undefined" && typeof name !== "undefined") {
        console.log("channel founeded 3");
        if (typeof name !== "undefined") {
          const filter = { _id: channelId };
          try {
            await channelModal.findOne(filter).then(async (doc) => {
              var update = doc;
              if (title?.length) {
                update.channelData.title = title;
              }
              if (name?.length) {
                update.channelData.name = name;
              }
              if (description?.length) {
                update.channelData.description = description;
              }
              if (website?.length) {
                update.channelData.website = website;
              }
              if (email?.length) {
                update.channelData.email = email;
              }
              if (walletId?.length > 10) {
                update.walletId = walletId;
                console.log("channelId added");
              }
              if (doc && doc.creator === userId) {
                await channelModal.updateOne(filter, update);
                res.json({ uploaded: true, responsData: doc });
              }
            });
          } catch (error) {}
        } else {
          res.json({
            message: "EnterChannelUserName",
          });
        }
      } else if (docadded) {
        res.json({
          message: "EamilNotFinded",
        });
      }
    }
  });
});

export default createNewChannel;
