import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/userModal.js";
const allVideos = express.Router();
import videoModal from "../../../db/schema/video.js";
import url from "url";
import allVideoCategory from "./all-video-utils/allVideoCategory.js";
allVideos.get("/:length", async (req, res) => {
  console.log(req);
  let limitLength = req.params.length;
  let skipLength = parseInt(limitLength) || 0;
  const query = req.query; // query = {sex:"female"}
  const category = query?.category;
  let pageSize = 100;
  if (category) {
    await allVideoCategory(req, res);
  } else {
    videoModal
      .find(
        {
          location: { $exists: true },
          $expr: { $gt: [{ $strLenCP: "$location" }, 1] },
        },
        {
          channelId: 1,
          title: 1,
          _id: 1,
          thumbnail: 1,
          duration: 1,
          createdAt: 1,
          views: 1,
          location: 1,
        }
      )
      .skip(skipLength)
      .limit(pageSize)
      .then(async (allVideos) => {
        // console.log("data videos", "here", allVideos[10].views);
        const vidoesData = allVideos;
        let dataFinal = [];
        let vidId;
        if (allVideos.length >= 1) {
          await Promise.all(
            vidoesData.map(async (vid, index) => {
              vidId = vid.channelId;
              await channelModal
                .findOne(
                  { _id: vidId },
                  {
                    _id: 1,
                    "channelData.title": 1,
                    "channelData.name": 1,
                    "channelData.profileImg.url": 1,
                    followersCount: { $size: "$followers" },
                  }
                )
                .then(async (channel) => {
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
  }
});

export default allVideos;
