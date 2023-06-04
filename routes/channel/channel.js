import express from "express";
import routesChannelDeletes from "./delete/channelDeletes.js";
import routesChannelGet from "./get/channelgets.js";
import routesChannelPosts from "./post/channelposts.js";

const routesChannel = express.Router();
routesChannel.use("/", routesChannelGet);
routesChannel.use("/", routesChannelPosts);
routesChannel.use("/", routesChannelDeletes);

export default routesChannel;
