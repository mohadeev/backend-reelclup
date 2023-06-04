import webrtc from "wrtc";
import User from "../../../db/schema/userModal.js";
import videoModal from "../../../db/schema/video.js";

const createLiveStream = async (req, res) => {
  const { channelId } = req.body;
  const userId = req.userId;
  await User.findOne({ _id: userId }).then(async (docadded) => {
    if (docadded) {
      await videoModal
        .create({
          channelId,
          creatore: userId,
          forLive: true,
          streaming: { created: true },
        })
        .then((newFile) => {
          res.json({ responseData: newFile, uploaded: true });
        });
    }
  });
};
export default createLiveStream;
