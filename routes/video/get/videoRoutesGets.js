import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import allVideos from "./allVideos.js";
import favoritesVideos from "./favoritesVideos.js";
import historyVideo from "./historyvideo.js";
// import renderVideo from "./rendervideo.js";
import videoData from "./videoData.js";
import watchLater from "./watchLater.js";
const videoRoutesGets = express.Router();
videoRoutesGets.use(`/get/video/display`, allVideos);

const allRoutes = [
  // {
  //   name: renderVideo,
  //   auth: false,
  // },
  {
    name: allVideos,
    auth: false,
    rout: "/display",
  },
  {
    name: videoData,
    auth: false,
    rout: "",
  },
  {
    name: historyVideo,
    auth: true,
    rout: "/history-video/",
  },

  {
    name: favoritesVideos,
    auth: true,
    rout: "/favorites-video/",
  },
  {
    name: watchLater,
    auth: true,
    rout: "/watch-later-video/",
  },
  //
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      videoRoutesGets.use(`/get/video${rout}:token`, AuthToken, name);
    } else {
      videoRoutesGets.use(`/`, name);
    }
  } else {
    if (rout) {
      videoRoutesGets.use(`/get/video${rout}`, name);
    } else {
      videoRoutesGets.use(`/`, name);
    }
  }
});

export default videoRoutesGets;
