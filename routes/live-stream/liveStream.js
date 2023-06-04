import express from "express";

import liveStreamPosts from "./post/liveStreamPosts.js";

const liveStream = express.Router();
// liveStream.use("/", liveStreamGet);
liveStream.use("/", liveStreamPosts);
// liveStream.use("/", liveStreamDeletes);

export default liveStream;
