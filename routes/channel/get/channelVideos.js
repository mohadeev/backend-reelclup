import express from "express";
import mongoose from "mongoose";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/userModal.js";
import videoModal from "../../../db/schema/video.js";
const channelVideos = express.Router();

channelVideos.get("/get/channel/all-vidoes/:channelId", async (req, res) => {
  console.log("data: is here videos");
  const channelId = req.params.channelId;
  if (mongoose.Types.ObjectId.isValid(channelId)) {
    await channelModal.findOne({ _id: channelId }).then((channelData) => {
      if (channelData) {
        videoModal
          .find({ channelId: channelData._id })
          // .limit(8)
          .then(async (allVideos) => {
            const vidoesData = allVideos;
            let dataFinal = [];
            if (allVideos) {
              await Promise.all(
                vidoesData.map(async (vid, index) => {
                  const data = {
                    channelData: channelData,
                    videoData: vid,
                    index: index,
                  };
                  await dataFinal.push(data);
                })
              );
              res.json({
                responseData: dataFinal.sort((a, b) =>
                  a.index < b.index ? 1 : -1
                ),
              });
            }
          });
      }
    });
  }
});

export default channelVideos;
