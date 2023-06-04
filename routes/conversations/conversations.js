import express from "express";
import mongoose from "mongoose";
import Message from "../../db/schema/Message.js";
import Converstion from "../../db/schema/Converstions.js";
import eachConv from "./eachconv.js";

const router = express.Router();
router.post("/", async (req, res) => {
  const UserId = req.headers.a_custom_header;
  const { receiver } = req.body;
  try {
    await Converstion.find({
      members: { $in: [UserId] },
    }).then(async (document) => {
      if (document) {
        let filtered = document.filter(
          (conver) =>
            conver.members?.includes(UserId) &&
            conver.members?.includes(receiver)
        );
        if (filtered.length <= 0) {
          try {
            await Converstion.create({ members: [UserId, receiver] }).then(
              (convers) => {
                res.json(convers);
              }
            );
          } catch (err) {
            res.status(500).status.json(err);
          }
        } else {
          res.status(200).json({ data: filtered });
        }
      } else {
        try {
          await Converstion.create({ members: [UserId, receiver] }).then(
            (convers) => {
              res.json(convers);
            }
          );
        } catch (err) {
          res.status(500).json(err);
        }
      }
    });
  } catch (err) {
    res.json(err);
  }
});

router.get("/get-conv/:id", async (req, res) => {
  let str = req.path.slice(10);
  if (mongoose.Types.ObjectId.isValid(str)) {
    if (str.length >= 12 && str.length <= 24)
      await Converstion.findOne({ _id: str }).then((userdoc) => {
        if (userdoc) {
          res.json({ data: { userdoc } });
        }
      });
  }
});
router.get("/", async (req, res) => {
  const UserId = req.headers.a_custom_header;
  if (typeof UserId !== "undefined") {
    try {
      await Converstion.find({
        members: { $in: [UserId] },
      }).then(async (document) => {

        res.status(200).json({ data: document });
      });
    } catch (err) {
      res.json(err);
    }
  }
});

router.post("/unread/:id", async (req, res) => {
  const { conversationId } = req.body;
  const { lastmessage } = req.body;
  let conditions = { unread: false, conversationId, lastmessage };
  if (mongoose.Types.ObjectId.isValid(conversationId && lastmessage)) {
    await Message.updateMany(conditions, { unread: true }).then(async () => {
      await Message.findOne({ _id: lastmessage, conversationId }).then(
        async (documentmessage) => {
          const data2 = await Message.find().sort({ _id: -1 }).limit(10);
          res.json({ data: { messages: data2, lastmessage: documentmessage } });
        }
      );
    });
  }
});

router.get("/:id", eachConv);

export default router;
