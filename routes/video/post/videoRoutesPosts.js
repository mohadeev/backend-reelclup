import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
// import createNewVideo from "./createNewvideo.js";
import newUpload from "./newUpload.js";
import createNewThumbnail from "./createNewThumbnail.js";
import addToFavorites from "./addToFavorites.js";
import addToWatchLater from "./addToWatchLater.js";
import commentVideo from "./commentvideo.js";
import likeVideo from "./likevideo.js";
import submiteVideo from "./submitevideo.js";
import uplaodFiles2 from "./uplaodFiles2.js";
import createNewVideo from "./createNewvideo.js";
import deleteVideo from "./deletevideo.js";
const videoRoutesPosts = express.Router();

const allRoutes = [
  {
    name: createNewVideo,
    auth: false,
    rout: false,
  },
  // {
  //   name: newUpload,
  //   auth: false,
  //   rout: false,
  // },
  // {
  //   name: uplaodFiles2,
  //   auth: false,
  //   rout: false,
  // },

  {
    name: createNewThumbnail,
    auth: true,
  },
  {
    name: submiteVideo,
    auth: true,
    rout: "/submite-video/",
  },
  {
    name: likeVideo,
    auth: true,
    rout: "/like-video/",
  },

  {
    name: commentVideo,
    auth: true,
    rout: "/comment-video/",
  },
  {
    name: addToFavorites,
    auth: true,
    rout: "/add-to-favorites/",
  },
  {
    name: addToWatchLater,
    auth: true,
    rout: "/add-to-watch-later/",
  },
  {
    name: deleteVideo,
    auth: true,
    rout: "/delete-video/",
  },
  //
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      videoRoutesPosts.use(`/post/video${rout}:token`, AuthToken, name);
    } else {
      videoRoutesPosts.use(`/`, name);
    }
  } else {
    if (rout) {
      videoRoutesPosts.use(`/post/chanel${rout}:token`, name);
    } else {
      videoRoutesPosts.use(`/`, name);
    }
  }
});

export default videoRoutesPosts;
