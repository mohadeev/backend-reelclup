import express from "express";
import videoRoutesGets from "./get/videoRoutesGets.js";
import videoRoutesPosts from "./post/videoRoutesPosts.js";
const videoRoutes = express.Router();

videoRoutes.use("/", videoRoutesGets);
videoRoutes.use("/", videoRoutesPosts);
// videoRoutes.use("/", videoRoutesDeletes);

export default videoRoutes;
