import mongoose from "mongoose";

const tagsSchema = mongoose.Schema(
  {
    tag: {
      type: String,
    },
  },
  { timestamps: true }
);

const tag = mongoose.model("message", tagsSchema);
export default tag;
