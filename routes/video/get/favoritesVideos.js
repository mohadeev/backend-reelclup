import express from "express";
import channelModal from "../../../db/schema/channelModel.js";
import User from "../../../db/schema/userModel.js";
const favoritesVideos = express.Router();
import videoModal from "../../../db/schema/videoModel.js";

favoritesVideos.get("/", async (req, res) => {
  let dataFinal = [];
  const userId = req.userId;

  await User.findOne({ _id: userId }).then(async (userData) => {
    if (userData) {
      const videoWatchLater = userData.favorites.length - 11;
      const favorites = userData.favorites;
      let videoId;
      await Promise.all(
        favorites.map(async (item, index) => {
          if (index > videoWatchLater) {
            videoId = item.id;
            await videoModal
              .findOne({ _id: videoId })
              .then(async (wthcltrVid) => {
                let channelId;
                if (wthcltrVid) {
                  channelId = wthcltrVid.channelId;
                  await channelModal
                    .findOne({ _id: channelId })
                    .then(async (channel) => {
                      const data = {
                        index: index,
                        channelData: channel,
                        videoData: wthcltrVid,
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

export default favoritesVideos;
