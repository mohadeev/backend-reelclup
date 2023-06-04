import mongoose from "mongoose";

const channelSchema = {
  creator: { type: String, required: true },
  followers: [],
  uploads: [],
  tags: [],
  comments: [],
  walletId: { type: String },
  playList: [],
  likes: [],
  default: { type: Boolean, default: false },
  community: [{}],
  channelData: {
    numbers: {},
    email: {
      type: String,
    },

    title: {
      type: String,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    profileImg: {
      profileImgUpload: {
        id: String,
        fileKey: String,
        filename: String,
        finished: { type: Boolean, default: false },
        uplaoded: { type: Boolean, default: false },
        updated: { type: Boolean, default: false },
      },
      url: String,
      id: String,
      asset_id: String,
    },
    coverImg: {
      coverImgImgUpload: {
        id: String,
        fileKey: String,
        filename: String,
        finished: { type: Boolean, default: false },
        uplaoded: { type: Boolean, default: false },
        updated: { type: Boolean, default: false },
      },
      url: String,
      id: String,
      asset_id: String,
    },
  },
};
//   // { timestamps: true }
var lengthOfAsUsers = channelSchema.followers.length;
const uploads = channelSchema.uploads.length;
const likes = channelSchema.likes.length;

// channelSchema.channelData.numbers = {
//   followers: { type: Number, default: lengthOfAsUsers },
//   uploads: { type: Number, default: uploads },
//   linkes: { type: Number, default: likes },
// };
var SkillSchema = new mongoose.Schema(channelSchema, { timestamps: true });

const channelModal = mongoose.model("channels", SkillSchema);
export default channelModal;
