import videoModal from "../../db/schema/video.js";

import path from "path";
import cookie from "cookie";
let rooms = [];

const LiveComment = (io, socket, rooms) => {
  socket.on("new-comment", (commentData) => {
    var cookief = socket.handshake.headers.cookie;
    const roomId = commentData.videoId;
    console.log("this is the roomId", roomId);
    const filtered = rooms.filter((rm) => rm.roomId === roomId);
    filtered.map((roomData) => {
      const userStreamerId = roomData.socketId;
      console.log("comment text", commentData.comment);
      socket.to(userStreamerId).emit("new-comment", commentData.comment);
      io.to(userStreamerId).emit("new-comment", commentData.comment);
      const viewers = roomData.viewers;
      if (viewers?.length) {
        viewers.map(({ socketId }) => {
          if (socketId) {
            console.log("sent to ", socketId);
            socket.to(socketId).emit("new-comment", commentData.comment);
            io.to(socketId).emit("new-comment", commentData.comment);
          }
        });
      }
    });
  });
};

export default LiveComment;
