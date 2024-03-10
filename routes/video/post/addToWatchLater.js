import express from "express";
const addToWatchLater = express.Router();

import mongoose from "mongoose";
import userModel from "../../../db/schema/userModel.js";

import videoModal from "../../../db/schema/videoModel.js";

addToWatchLater.post("/", async (req, res) => {
  const { videoId } = req.body;
  const userId = req.userId;

  if (mongoose.Types.ObjectId.isValid(videoId)) {
    try {
      userModel.findOne({ _id: userId }).then(async (useData) => {
        await videoModal.findOne({ _id: videoId }).then(async (vid) => {
          if (vid) {
            let arrayLikes = useData.watchLater;
            const index = arrayLikes.findIndex(({ id }) => id === videoId);
            if (index < 0) {
              arrayLikes.push({ id: videoId });
            } else if (index >= 0) {
              arrayLikes.splice(index, 1);
            }
            const update = { watchLater: arrayLikes };
            const filter = { _id: userId };
            try {
              await userModel.updateOne(filter, update);
              await userModel.findOne(filter).then((resuelt) => {
                if (resuelt) {
                  const newLiked = resuelt.watchLater.some(
                    ({ id }) => id === videoId
                  );
                  console.log("arrayLikes", resuelt.watchLater);
                  console.log("newLiked", newLiked);
                  res.json({
                    responseData: {
                      data: newLiked,
                    },
                  });
                }
              });
            } catch (error) {
              res.end({ error: error.message });
            }
          }
        });
      });
    } catch (error) {
      res.end({ error: error.message });
    }
  }
});

export default addToWatchLater;
