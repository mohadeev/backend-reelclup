import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
    conversationId: String,
    message: {
      type: String,
      required: true,
    },
    unread: Boolean,
    nothing: String,
    sender: {
      type: String,
    },
    receiver: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("message", MessageSchema);
export default Message;
