import express from "express";
const likeVideo = express.Router();

import mongoose from "mongoose";

import videoModal from "../../../db/schema/videoModel.js";

likeVideo.post("/", async (req, res) => {
  const { IsLiked, IsDisLiked, videoId } = req.body;
  const userId = req.userId;
  if (mongoose.Types.ObjectId.isValid(videoId)) {
    await videoModal.findOne({ _id: videoId }).then(async (vid) => {
      if (vid) {
        let arrayDisLikes = vid.disLikes;
        let arrayLikes = vid.likes;
        let isLiked = arrayLikes.some(({ id }) => id === userId);
        let isDisLiked = arrayDisLikes.some(({ id }) => id === userId);
        if (IsLiked && !IsDisLiked) {
          const newFilteredDisLikes = arrayDisLikes.filter(
            ({ id }) => id !== userId
          );
          if (!isLiked) {
            arrayLikes.push({ id: userId });
          } else if (isLiked) {
            arrayLikes.filter(({ id }) => id !== userId);
          }

          const update = { likes: arrayLikes, disLikes: newFilteredDisLikes };
          const filter = { _id: videoId };
          try {
            await videoModal.updateOne(filter, update);
            await videoModal.findOne(filter).then((resuelt) => {
              if (resuelt) {
                const newLiked = resuelt.likes.some(({ id }) => id === userId);
                const newDisLiked = resuelt.disLikes.some(
                  ({ id }) => id === userId
                );

                res.json({
                  responseData: {
                    likes: { liked: newLiked, likes: resuelt.likes.length },
                    disLikes: {
                      isDisLiked: newDisLiked,
                      disLikes: resuelt.disLikes.length,
                    },
                  },
                });
              }
            });
          } catch (error) {
            res.end({ error: error.message });
          }
        } else if (!IsLiked && IsDisLiked) {
          if (isLiked) {
            arrayLikes = arrayLikes.filter(({ id }) => id !== userId);
          }
          if (!isDisLiked) {
            arrayDisLikes.push({ id: userId });
          }

          const update = { likes: arrayLikes, disLikes: arrayDisLikes };
          const filter = { _id: videoId };
          try {
            await videoModal.updateOne(filter, update);
            await videoModal.findOne(filter).then((resuelt) => {
              if (resuelt) {
                isLiked = resuelt.likes.some(({ id }) => id === userId);
                isDisLiked = resuelt.disLikes.some(({ id }) => id === userId);

                res.json({
                  responseData: {
                    likes: { liked: isLiked, likes: resuelt.likes.length },
                    disLikes: {
                      isDisLiked: isDisLiked,
                      disLikes: resuelt.disLikes.length,
                    },
                  },
                });
              }
            });
          } catch (error) {
            res.end({ error: error.message });
          }
        } else if (!IsLiked && !IsDisLiked) {
          const newFilteredDisLikes = arrayDisLikes.filter(
            ({ id }) => id !== userId
          );
          const newFilteredLikes = arrayLikes.filter(({ id }) => id !== userId);

          const update = {
            likes: newFilteredLikes,
            disLikes: newFilteredDisLikes,
          };
          const filter = { _id: videoId };
          try {
            await videoModal.updateOne(filter, update);
            await videoModal.findOne(filter).then((resuelt) => {
              if (resuelt) {
                isLiked = resuelt.likes.some(({ id }) => id === userId);
                isDisLiked = resuelt.disLikes.some(({ id }) => id === userId);
                res.json({
                  responseData: {
                    likes: { liked: isLiked, likes: resuelt.likes.length },
                    disLikes: {
                      isDisLiked: isDisLiked,
                      disLikes: resuelt.disLikes.length,
                    },
                  },
                });
              }
            });
          } catch (error) {
            res.end({ error: error.message });
          }
        }
      }
    });
  }
});

export default likeVideo;
