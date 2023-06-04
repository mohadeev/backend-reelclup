import express from "express";
import imagesGetRouts from "./get/imagesGetRouts.js";

const imagesRoutes = express.Router();
imagesRoutes.use("/", imagesGetRouts);

export default imagesRoutes;
