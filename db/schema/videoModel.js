import mongoose from "mongoose";

const videoSchema = mongoose.Schema(
  {
    creatore: String,
    channelId: String,
    location: String,
    filename: String,
    fileId: String,
    category: String,
    title: {
      type: String,
    },
    description: {
      type: String,
      videoCategory: String,
    },
    duration: String,
    thumbnail: String,
    forLive: { type: Boolean, default: false },
    likes: [{ id: String }],
    disLikes: [{ id: String }],
    comments: [{ id: String }],
    views: [{ id: String }],
    date: {
      type: Date,
      default: Date.now(),
    },
    share: {
      type: Boolean,
      default: false,
    },
    forLive: { type: Boolean, default: false },
    forShorts: { type: Boolean, default: false },
    forWatch: { type: Boolean, default: false },
    // type  :{}
    streaming: {
      socketId: String,
      created: { type: Boolean, default: false },
      completed: { type: Boolean, default: false },
      isLive: { type: Boolean, default: false },
    },
    uploaded: {
      id: String,
      filename: String,
      fileKey: String,
      finished: { type: Boolean, default: false },
      uplaoded: { type: Boolean, default: false },
      updated: { type: Boolean, default: false },
    },
    thumbnailupload: {
      id: String,
      fileKey: String,
      filename: String,
      finished: { type: Boolean, default: false },
      uplaoded: { type: Boolean, default: false },
      updated: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const videoModel = mongoose.model("video", videoSchema);
export default videoModel;
