import express from "express";
import mongoose from "mongoose";
import commentModal from "../../../db/schema/comment.js";
import User from "../../../db/schema/userModel.js";
import videoModal from "../../../db/schema/videoModel.js";
import resErrorFunc from "../../../utils/resErrorFunc.js";
import awsDeleteFile from "./upload/awsDeleteFile.js";
const deleteVideo = express.Router();
deleteVideo.post("/", async (req, res) => {
  console.log("deleting a video");
  const videoId = req?.body?.videoId;
  console.log("deleting a video");
  const userId = req.userId;
  if (mongoose.Types.ObjectId.isValid(videoId)) {
    await User.findOne({ _id: userId }).then(async (docadded) => {
      console.log(docadded?.username);
      if (docadded) {
        await videoModal
          .findOne({ creatore: userId, id: videoId })
          .then(async (videoFinded) => {
            if (videoFinded && videoFinded.creatore === userId) {
              try {
                await videoModal
                  .findByIdAndRemove({ _id: videoId })
                  .then(async (delted) => {
                    console.log("you are the owner of the video");
                    //const isDeleted = await awsDeleteFile();
                    console.log("Key video", videoFinded.uploaded.fileKey);
                    console.log(
                      "Key images",
                      videoFinded.thumbnailupload?.fileKey
                    );
                    await awsDeleteFile(
                      "video-thumbnail",
                      videoFinded.uploaded.fileKey
                    );
                    await awsDeleteFile(
                      "video-thumbnail",
                      videoFinded.thumbnailupload?.fileKey
                    );
                    await commentModal.deleteMany({
                      videoId: videoId,
                    });
                    res.json({ reponseData: true });
                  });
              } catch (error) {
                return null;
              }
            } else {
              console.log("you are not the owner of the video");
            }
          });
      } else if (!docadded) {
        res.json({
          message: "EamilNotFinded",
        });
      }
    });
  } else {
    resErrorFunc(res, "YOUR-ARE-NOT-OWNER");
  }
});

export default deleteVideo;
