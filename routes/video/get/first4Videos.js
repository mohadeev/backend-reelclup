import express from "express";
import channelModal from "../../../db/schema/channelModel.js";
import User from "../../../db/schema/userModel.js";
const first4Videos = express.Router();
import videoModal from "../../../db/schema/videoModel.js";

first4Videos.get("/", async (req, res) => {
  let limitLength = req.params.length;
  let skipLength = parseInt(limitLength) || 0;
  let pageSize = 100;

  videoModal
    .find(
      {
        location: { $exists: true },
        $expr: { $gt: [{ $strLenCP: "$location" }, 1] },
      },
      { name: 1, age: 1, _id: 0 }
    )
    .skip(skipLength)
    .limit(pageSize)
    .then(async (allVideos) => {
      const vidoesData = allVideos;
      let dataFinal = [];
      let vidId;
      if (allVideos.length >= 1) {
        await Promise.all(
          vidoesData.map(async (vid, index) => {
            vidId = vid.channelId;
            await channelModal.findOne({ _id: vidId }).then(async (channel) => {
              if (channel && channel?._id) {
                const data = {
                  index: index + skipLength,
                  channelData: channel,
                  videoData: vid,
                };
                await dataFinal.push(data);
              }
            });
          })
        );
        console.log(dataFinal.length);
        res.json({
          responseData: dataFinal.sort((a, b) => 0.5 - Math.random()),
        });
      } else {
        res.json({ responseData: [] });
      }
    });
});

export default first4Videos;
