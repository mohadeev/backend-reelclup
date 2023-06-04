import mongoose from "mongoose";

const ConverstionSchema = mongoose.Schema(
  {
    members: { type: Array },
  },
  { timestamps: true }
);

const Converstion = mongoose.model("converstion", ConverstionSchema);
export default Converstion;
