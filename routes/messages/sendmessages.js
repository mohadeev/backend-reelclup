import express from "express";
import mongoose from "mongoose";
import Message from "../../db/schema/Message.js";
import Converstion from "../../db/schema/Converstions.js";

const sendmessages = async (req, res) => {
  const asPath = req.path;
  let UrlBeRemove = "/get-mesages/";
  let scrolling = req.headers.scrolling;
  let convId = asPath.replace(UrlBeRemove, "").toString("hex");
  const UserId = req.headers.a_custom_header;
  if (!mongoose.Types.ObjectId.isValid(convId)) {
  } else if (
    mongoose.Types.ObjectId.isValid(convId) &&
    convId.length >= 12 &&
    convId.length <= 24 &&
    typeof UserId !== "undefined"
  ) {
    await Converstion.findOne({ _id: convId }).then(async (Coversion) => {
      if (Coversion) {
        if (Coversion.members.includes(UserId)) {
          try {
            const data = await Message.find({ conversationId: convId });
            res.json({ data: data });
          } catch (erro) {
            res.status(500).json(erro.message);
          }
        }
      }
    });
  } else {
  }
};
export default sendmessages;
