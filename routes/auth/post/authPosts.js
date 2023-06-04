import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import changeEmail from "./changeEmail.js";
import updateAccountData from "./updateAccountData.js";
const authPosts = express.Router();

const allRoutes = [
  {
    name: updateAccountData,
    auth: false,
  },
  {
    name: changeEmail,
    auth: true,
    rout: "/change-email/",
  },
  {
    name: updateAccountData,
    auth: true,
    rout: "/update-account-data/",
  },
  ,
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      authPosts.use(`/post/auth${rout}:token`, AuthToken, name);
    } else {
      authPosts.use(`/`, AuthToken, name);
    }
  } else {
    if (rout) {
      authPosts.use(`/post/auth${rout}`, name);
    } else {
      authPosts.use(`/`, name);
    }
  }
});

export default authPosts;
