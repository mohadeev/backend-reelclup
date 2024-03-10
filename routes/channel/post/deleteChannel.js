import express from "express";
import channelModal from "../../../db/schema/channelModel.js";
import User from "../../../db/schema/userModel.js";
const deleteChannel = express.Router();
deleteChannel.post("/", async (req, res) => {
  const { channelId } = req.body;
  console.log("deleting a channel");
  const userId = req.userId;
  await User.findOne({ _id: userId }).then(async (docadded) => {
    console.log(docadded?.username);
    if (docadded) {
      await channelModal
        .findOne({ creator: userId, id: channelId })
        .then(async (channelFinded) => {
          if (channelFinded && channelFinded.creator === userId) {
            try {
              await channelModal
                .findByIdAndRemove({ _id: channelId })
                .then(async (delted) => {
                  await channelModal
                    .find({ creator: userId })
                    .then((channels) => {
                      if (channels.length) {
                        res.json({ responsData: channels });
                      } else {
                        res.json({
                          responsMessage: "NoChanelFounded",
                          responsData: [],
                        });
                      }
                    });
                });
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

export default deleteChannel;
