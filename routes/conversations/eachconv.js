import mongoose from "mongoose";
import User from "../../db/schema/userModel.js";
import Message from "../../db/schema/Message.js";

const eachConv = async (req, res) => {
  let str = req.path.slice(1);
  const UserId = req.headers.a_custom_header;
  if (str.length >= 12 && str.length <= 24)
    await User.findOne({ _id: str }).then(async (userdoc) => {
      if (userdoc) {
        try {
          var datamessage = await Message.find({
            conversationId: UserId,
          });
          var unreadmessagesArray = datamessage.filter(
            (messages) => messages.unread === false && messages.receiver !== str
          );
        } catch (err) {}

        let data = userdoc;
        const username = data.username;
        let id = data._d;
        let image = data.image;
        let unreadmessges = unreadmessagesArray.length;
        if (datamessage.length >= 1 && unreadmessagesArray.length >= 1) {
          const lastmessage = datamessage[datamessage.length - 1];
          res.json({
            data: { username, id, image, unreadmessges, lastmessage },
          });
        } else if (datamessage.length >= 1 && unreadmessagesArray.length <= 0) {
          const lastmessage = datamessage[datamessage.length - 1];
          res.json({ data: { username, id, image, lastmessage } });
        } else {
          res.json({ data: { username, id, image } });
        }
      }
    });
};

export default eachConv;
