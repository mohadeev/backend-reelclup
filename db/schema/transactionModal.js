import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    transactionFrom: Object,
    transactionTo: Object,
    hash: String,
    sendShash: String,
  },
  { timestamps: true }
);

const transactionModal = mongoose.model("transaction", transactionSchema);
export default transactionModal;
