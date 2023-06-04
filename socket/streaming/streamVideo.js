import videoModal from "../../db/schema/video.js";

import path from "path";
import cookie from "cookie";
import LiveComment from "./LiveComment.js";
import desconnectFromRoom from "./desconnectFromRoom.js";
let rooms = [];
let broadcaster;
let roomswaiting = [];
const streamVideo = (io, socket) => {
  LiveComment(io, socket, rooms);
  desconnectFromRoom(io, socket, rooms);
  socket.broadcast.emit("new-broadcaster", broadcaster);
  socket.on("broadcaster", async ({ socketId, videoId }) => {
    broadcaster = socketId;
    socket.emit("broadcaster", broadcaster);
    if (videoId) {
      const filter = { _id: videoId };
      const update = {
        streaming: {
          socketId: socketId,
          created: true,
          isLive: true,
        },
      };
      videoModal.findOneAndUpdate(filter, update, (error, resuel) => {
        if (resuel) {
          socket.broadcast.emit("new-broadcaster", socket.id);
        }
      });
    }
    const roomId = videoId;
    socket.join(roomId);
    const filtered = rooms.findIndex((rm) => rm.roomId === roomId);
    if (filtered >= 0) {
      rooms[filtered].socketId = socket.id;
      console.log("hey ", roomId, "socket changed", socket.id);
    } else if (filtered < 0) {
      rooms.push({
        roomId,
        socketId: socket.id,
        viewers: [],
      });
      console.log("hey ", roomId, "you just creatd your room");
    }
    socket.broadcast.emit("new-broadcaster", socket.id);
  });

  socket.on("watcher", ({ videoId }) => {
    const filtered = rooms.filter((rm) => rm.roomId === videoId);
    const filteredIndex = rooms.findIndex((rm) => rm.roomId === videoId);
    let viewers = rooms[filteredIndex]?.viewers;
    const isIn = viewers?.some((m) => m.socketId === socket.id);
    console.log(isIn);
    if (filtered.length >= 1) {
      if (viewers.length >= 1) {
        rooms[filteredIndex].viewers.push({ socketId: socket.id });
      } else {
        rooms[filteredIndex].viewers = [{ socketId: socket.id }];
      }
      console.log("viewrs now are", rooms[filteredIndex].viewers);
      const roomSocketId = filtered[0].socketId;
      socket.to(roomSocketId).emit("watcher", {
        id: socket.id,
        viewers: rooms[filteredIndex].viewers,
      });
      viewers.map(({ socketId }) => {
        socket
          .to(socketId)
          .emit("new-watcher-joined", rooms[filteredIndex].viewers.length);
        io.to(socketId).emit(
          "new-watcher-joined",
          rooms[filteredIndex].viewers.length
        );
      });
    } else {
      const filteredWaiting = roomswaiting.filter(
        (rm) => rm.roomId === videoId
      );
      const filteredIndexWaitgin = roomswaiting.findIndex(
        (rm) => rm.roomId === videoId
      );
      let viewersWaiting = roomswaiting[filteredIndexWaitgin]?.viewersWaiting;
      const isIn = viewers?.some((m) => m.socketId === socket.id);
      if (filteredWaiting.length >= 1) {
        if (viewersWaiting.length >= 1) {
          roomswaiting[filteredIndexWaitgin].viewersWaiting.push({
            socketId: socket.id,
          });
        } else {
          roomswaiting[filteredIndexWaitgin].viewersWaiting = [
            { socketId: socket.id },
          ];
        }
        const roomSocketId = filteredWaiting[0].socketId;
        socket.to(roomSocketId).emit("watcher", {
          id: socket.id,
          viewers: roomswaiting[filteredIndexWaitgin].viewersWaiting,
        });
      }
    }
  });
  socket.on("offer", (id, message) => {
    console.log("make offer");
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
    console.log("answer sent");
  });
  socket.on("candidate", (id, message) => {
    console.log("make answer answer");
    socket.to(id).emit("candidate", socket.id, message);
    console.log("candidate", id);
  });

  socket.on("finish-live", (data) => {});
};

export default streamVideo;
