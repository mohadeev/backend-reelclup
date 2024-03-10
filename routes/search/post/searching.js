import express from "express";
import channelModal from "../../../db/schema/channelModel.js";
import User from "../../../db/schema/userModel.js";
import videoModal from "../../../db/schema/videoModel.js";
const searching = express.Router();

searching.post("/", async (req, res) => {
  const searchData = req.body.searchData;
  const channels = await channelModal.find({});
  const videos = await videoModal.find({});
  let allChannels = [];
  if (channels?.length >= 1 && searchData?.length >= 1) {
    const filtered = channels.filter(({ channelData }) => {
      return (
        channelData?.name?.includes(searchData) ||
        channelData?.title?.includes(searchData) ||
        channelData?.title?.includes(searchData)
      );
    });
    allChannels = filtered;
    console.log("filtered", filtered.length);
  }

  let dataFinal = [];
  let vidId;
  if (videos?.length >= 1 && searchData?.length >= 1) {
    const filtered = videos.filter((vid) => {
      return (
        vid?.descreption?.includes(searchData) ||
        vid?.title?.includes(searchData)
      );
    });
    console.log("filtered videos", filtered.length);
    await Promise.all(
      filtered.map(async (vid, index) => {
        vidId = vid.channelId;
        await channelModal.findOne({ _id: vidId }).then(async (channel) => {
          const data = {
            index: index,
            channelData: channel,
            videoData: vid,
          };
          await dataFinal.push(data);
        });
      })
    );
  }
  res.json({ channels: allChannels, videos: dataFinal });
  console.log("dataFinal", dataFinal.length);
});

export default searching;
