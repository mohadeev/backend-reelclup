import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import renderImages from "./renderImages.js";
const imagesGetRouts = express.Router();

const allRoutes = [
  {
    name: renderImages,
    auth: false,
  },
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      imagesGetRouts.use(`/post/chanel${rout}:token`, AuthToken, name);
    } else {
      imagesGetRouts.use(`/`, name);
    }
  } else {
    imagesGetRouts.use(`/`, name);
  }
});

export default imagesGetRouts;
