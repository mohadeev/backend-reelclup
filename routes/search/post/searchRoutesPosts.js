import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import searching from "./searching.js";

const searchRoutesPosts = express.Router();
//
const allRoutes = [
  {
    name: searching,
    auth: false,
    rout: "/searching",
  },
];
allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      searchRoutesPosts.use(`/post/search${rout}:token`, AuthToken, name);
    } else {
      searchRoutesPosts.use(`/`, name);
    }
  } else {
    searchRoutesPosts.use(`/post/search${rout}`, name);
  }
});

export default searchRoutesPosts;
