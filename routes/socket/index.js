import Message from "../../db/schema/Message.js";
import Converstion from "../../db/schema/Converstions.js";
import cookie from "cookie";
import Joinroom from "./joinroom.js";
import Sendmessage from "./sendmessage.js";
import lastlivemessage from "./lastlivemessage.js";

const SocketSend = (socket, AllUsers, io) => {
  // Joinroom(socket, AllUsers, io);
  //adduer to room
  Sendmessage(socket, AllUsers, io);
  lastlivemessage(socket, AllUsers, io);

  // socket.on("send-messageto-user", async (messagedata) => {
  //   const { sender, message, conversationId } = messagedata;
  //   const ConverId = await Converstion.findOne({ _id: conversationId });

  //   let RevieverArray = ConverId.members
  //     .filter((User) => User !== sender)
  //     .toString();
  //   let SenderArray = ConverId.members
  //     .filter((User) => User === sender)
  //     .toString();

  //   const ReciverSocketId = AllUsers.filter(
  //     (sender) => sender.userid === RevieverArray
  //   );
  //   const SenderSocketId = AllUsers.filter(
  //     (sender) => sender.userid === SenderArray
  //   );
  //   SenderSocketId.map((item) => {
  //     io.to(item.socketid).emit("get-the-live-message-local", {
  //       sender,
  //       message,
  //     });
  //   });

  //   if (typeof ReciverSocketId !== "undefined") {
  //     ReciverSocketId.map((item) => {
  //       io.to(item.socketid).emit("get-the-live-message-local", {
  //         sender,
  //         message,
  //       });
  //     });
  //   }
  // });
};

export default SocketSend;
