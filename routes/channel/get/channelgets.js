import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import allChannels from "./allChannels.js";
import chanelVideos from "./chanelVideos.js";
import channelPage from "./channelPage.js";
import followingChannels from "./followingChannels.js";
const routesChannelGet = express.Router();

const allRoutes = [
  {
    name: allChannels,
    auth: true,
    rout: "/all-channels",
  },
  {
    name: channelPage,
    auth: false,
    rout: "",
  },
  {
    name: chanelVideos,
    auth: false,
    rout: "",
  },
  {
    name: followingChannels,
    auth: true,
    rout: "/following-channels",
  },
  ,
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    routesChannelGet.use(`/get/channel${rout}:token`, AuthToken, name);
  } else {
    if (rout.length > 1) {
      routesChannelGet.use(`/get/channel/${rout}`, name);
    } else {
      routesChannelGet.use(`/`, name);
    }
  }
});

export default routesChannelGet;
