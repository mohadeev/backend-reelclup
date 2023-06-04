import webrtc from "wrtc";
import videoModal from "../../../db/schema/video.js";

const submitStream = async (req, res, allStreams) => {
  const { title, descreption } = req.body.videoData;
  const videoId = req.body.videoId;
  if (videoId) {
    const filter = { _id: videoId };
    const update = { descreption: descreption, title: title };
    videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
      if (resuel) {
        res.json({ ready: true });
      }
    });
  }
};
export default submitStream;
