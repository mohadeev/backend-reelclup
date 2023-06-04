import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import addWallte from "./addWallte.js";
import swapCoin from "./swapCoin.js";

const cryptoRoutesPosts = express.Router();
const allRoutes = [
  { name: addWallte, auth: true, rout: "/add-wallet" },
  { name: swapCoin, auth: false, rout: "/swap" },
];
allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      cryptoRoutesPosts.use(`/post/crypto${rout}:token`, AuthToken, name);
    } else {
      cryptoRoutesPosts.use(`/`, name);
    }
  } else {
    cryptoRoutesPosts.use(`/post/crypto${rout}`, name);
  }
});

export default cryptoRoutesPosts;
