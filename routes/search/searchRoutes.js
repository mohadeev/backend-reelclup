import express from "express";
import searchRoutesGets from "./get/searchRoutesGets.js";
import searchRoutesPosts from "./post/searchRoutesPosts.js";
const searchRoutes = express.Router();
// searchRoutes.get("/get/search/display", (rq, res) => {
//   res.json([]);
// });
searchRoutes.use("/", searchRoutesGets);
searchRoutes.use("/", searchRoutesPosts);
// searchRoutes.get("/get/search/all-search", (req, res) => {
//   res.json("aposdcaopcoapscaopsc");
// });
// searchRoutes.use("/", searchRoutesDeletes);

export default searchRoutes;
