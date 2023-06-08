import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    creatore: String,
    channelId: String,
    videoId: String,
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const commentModal = mongoose.model("comment", commentSchema);
export default commentModal;
