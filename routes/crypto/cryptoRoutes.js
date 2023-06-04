import express from "express";
import cryptoRoutesGets from "./get/cryptoRoutesGets.js";
import cryptoRoutesPosts from "./post/cryptoRoutesPosts.js";
const cryptoRoutes = express.Router();

cryptoRoutes.use("/", cryptoRoutesGets);
cryptoRoutes.use("/", cryptoRoutesPosts);

export default cryptoRoutes;
