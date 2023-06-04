import Message from "../../db/schema/Message.js";
import Converstion from "../../db/schema/Converstions.js";
import mongoose from "mongoose";

const lastlivemessage = (socket, AllUsers, io) => {
  socket.on("get-last-live-messages", async (data) => {
    Message.find({
      conversationsId: data.conversationsid,
    }).then((meesgess) => {
      if (meesgess.length > 0) {
        const items = meesgess[meesgess.length - 1];
        const lastmessage = "Hello im the last message here ";
        socket.emit("send-last-live-messages", [{ message: "aS" }]);
      }
    });
    // friendid: Id,
    //     conversationsid: ConveId,
    //     userid: User,
  });
};
export default lastlivemessage;
