import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import allSearch from "./allSearch.js";
const searchRoutesGets = express.Router();

const allRoutes = [
  {
    name: allSearch,
    auth: false,
    rout: "/all-search",
  },
];
allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      searchRoutesGets.use(`/get/search${rout}:token`, AuthToken, name);
    } else {
      searchRoutesGets.use(`/`, name);
    }
  } else {
    if (rout) {
      searchRoutesGets.use(`/get/search${rout}`, name);
    } else {
      searchRoutesGets.use(`/`, name);
    }
  }
});
searchRoutesGets.get("/get/search/all-search", (req, res) => {
  res.json("ASPO");
});

export default searchRoutesGets;
