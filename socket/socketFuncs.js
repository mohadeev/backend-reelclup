import videoModal from "../db/schema/videoModel.js";
import notification from "./notification.js";

import path from "path";
import cookie from "cookie";
import streamVideo from "./streaming/streamvideo.js";
// import finishUplaod from "./finishUplaod.js";

const socketFuncs = (io, socket) => {
  notification(io, socket);
  streamVideo(io, socket);
  // finishUplaod(io, socket);
  socket.on("socket-connected", (data) => {
    socket.emit("confirm-connection", data);
  });
};

export default socketFuncs;
