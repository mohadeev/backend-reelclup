import mongoose from "mongoose";

const UserScheme = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    channels: [{ id: String }],
    watchLater: [],
    favorites: [],
    notification: { type: Array, default: [] },
    // notification: [
    //   {
    //     id: String,
    //     seen: { type: Boolean, default: false },
    //     from: {
    //       channel: String,
    //       user: String,
    //       videoId: String,
    //       createAt: String,
    //     },
    //   },
    // ],
    date: {
      type: Date,
      default: Date.now(),
    },
    videoHistory: [{ id: String, watcheddAt: String }],
    // followingChannels: [{ id: String, followedAt: String }],
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", UserScheme);
export default userModel;
