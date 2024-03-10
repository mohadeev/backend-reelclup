import express from "express";
import channelModal from "../../../../db/schema/channelModel.js";
import User from "../../../../db/schema/userModel.js";
// const allVideoCategory = express.Router();
import videoModal from "../../../../db/schema/videoModel.js";
import url from "url";
const allVideoCategory = async (req, res) => {
  let limitLength = req.params.length;
  let skipLength = parseInt(limitLength) || 0;
  const query = req.query; // query = {sex:"female"}
  const category = query?.category;
  console.log("category", category);
  let pageSize = 100;
  videoModal
    .find(
      {
        location: { $exists: true },
        $expr: { $gt: [{ $strLenCP: "$location" }, 1] },
        category: category,
      },
      {
        channelId: 1,
        title: 1,
        _id: 1,
        thumbnail: 1,
        duration: 1,
        createdAt: 1,
        views: 1,
      }
    )
    .skip(skipLength)
    .limit(pageSize)
    .then(async (allVideoCategory) => {
      // console.log("data videos", "here", allVideoCategory[10].views);
      const vidoesData = allVideoCategory;
      let dataFinal = [];
      let vidId;
      if (allVideoCategory.length >= 1) {
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
};

export default allVideoCategory;
