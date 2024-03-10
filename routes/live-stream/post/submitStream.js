import webrtc from "wrtc";
import videoModal from "../../../db/schema/videoModel.js";

const submitStream = async (req, res, allStreams) => {
  const { title, description } = req.body.videoData;
  const videoId = req.body.videoId;
  if (videoId) {
    const filter = { _id: videoId };
    const update = { description: description, title: title };
    videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
      if (resuel) {
        res.json({ ready: true });
      }
    });
  }
};
export default submitStream;
