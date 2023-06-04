import express from "express";
import User from "../../../db/schema/userModal.js";
import channelModal from "../../../db/schema/channel.js";
const addWallte = express.Router();

addWallte.post("/", async (req, res) => {
  const channelId = req.body.channelId;
  const walletId = req.body.walletId;
  const userId = req.userId;

  await User.findOne({ _id: userId }).then(async (doc) => {
    if (doc) {
      channelModal
        .findOne({
          creator: userId,
          id: channelId,
        })
        .then(async (channel) => {
          if (channel) {
            if (channel?.walletId !== walletId) {
              const filter = { _id: channelId, creator: userId };
              const update = {
                walletId: walletId,
              };
              try {
                await channelModal.updateOne(filter, update);
                channelModal
                  .findOne({
                    creator: userId,
                    id: channelId,
                  })
                  .then(() => {
                    res.json({
                      responsData: channel,
                      message: "WALLET-CONNECTED-BEFOR",
                    });
                  });
              } catch (error) {}
            } else if (channel?.walletId === walletId) {
              res.json({ message: "WALLET-CONNECTED-BEFOR" });
            }
          } else {
            res.json({ message: "CHANNEL-NOT-FINEDED" });
          }
        });
    }
  });
});

export default addWallte;
