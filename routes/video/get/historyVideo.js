import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/userModal.js";
const historyVideo = express.Router();
import videoModal from "../../../db/schema/video.js";

historyVideo.get("/", async (req, res) => {
  let dataFinal = [];
  const userId = req.userId;
  await User.findOne({ _id: userId }).then(async (userData) => {
    if (userData) {
      const videoHistory = userData.videoHistory.length - 11;
      const hisory = userData.videoHistory;
      let videoId;
      await Promise.all(
        hisory.map(async (item, index) => {
          if (index > videoHistory) {
            videoId = item.id;
            await videoModal
              .findOne({ _id: videoId })
              .then(async (histyVid) => {
                let channelId;
                if (histyVid) {
                  channelId = histyVid.channelId;
                  await channelModal
                    .findOne({ _id: channelId })
                    .then(async (channel) => {
                      const data = {
                        index: index,
                        channelData: channel,
                        videoData: histyVid,
                      };
                      await dataFinal.push(data);
                    });
                }
              });
          }
        })
      );
      dataFinal.sort((a, b) => (a.index < b.index ? 1 : -1));
      res.json({ responseData: dataFinal });
    }
  });
});

export default historyVideo;
