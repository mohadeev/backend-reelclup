import Converstion from "../../db/schema/Converstions.js";

const sendmessage = (socket, AllUsers, io) => {
  socket.on("send-messageto-user", async (data) => {
    // const daddd = await Converstion.findOne({
    //   _id: data.conversationId,
    // });

    io.to(data.conversationId).emit("get-message", data);
    const receiver = data.receiver.toString("");
    const sender = data.sender.toString("");
    const sendersid = AllUsers.filter((user) => (user.userid = sender));
    const revieverid = AllUsers.filter((user) => (user.userid = receiver));

    revieverid.map((Reviever) => {
      io.to(Reviever.socketid).emit("get-message", data);
    });
    sendersid.map((Senders) => {
      io.to(Senders.socketid).emit("get-message1", data);
    });

    // socket.to(data.conversationId).emit("get-message1", data);
    // socket.emit("get-message2", data);
    // socket.broadcast.to(data.conversationId).emit("get-message3", data);
    // // socket.broadcast.emit("get-message4", data);
    // io.in(data.conversationId).emit("get-message5", data);
  });
};
export default sendmessage;
