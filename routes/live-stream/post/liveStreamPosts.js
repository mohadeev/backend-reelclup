import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import stream from "./stream.js";
const liveStreamPosts = express.Router();

const allRoutes = [
  {
    name: stream,
    auth: false,
  },
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      liveStreamPosts.use(`/post/channel${rout}:token`, AuthToken, name);
    } else {
      liveStreamPosts.use(`/`, AuthToken, name);
    }
  } else {
    if (rout) {
      liveStreamPosts.use(`/post/channel${rout}`, name);
    } else {
      liveStreamPosts.use(`/`, name);
    }
  }
});

export default liveStreamPosts;
