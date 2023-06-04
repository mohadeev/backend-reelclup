import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import tokePrices from "./tokePrices.js";
const cryptoRoutesGets = express.Router();

const allRoutes = [
  { name: tokePrices, auth: false, rout: "/get-tokens-price/" },
];
allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      cryptoRoutesGets.use(`/get/crypto${rout}:token`, AuthToken, name);
    } else {
      cryptoRoutesGets.use(`/`, name);
    }
  } else {
    if (rout) {
      cryptoRoutesGets.use(`/get/crypto${rout}`, name);
    } else {
      cryptoRoutesGets.use(`/`, name);
    }
  }
});
cryptoRoutesGets.get("/get/crypto/all-crypto", (req, res) => {
  res.json("ASPO");
});

export default cryptoRoutesGets;
