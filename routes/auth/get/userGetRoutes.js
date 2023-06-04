import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import getUserData from "./getUserData.js";
import userNotification from "./userNotification.js";

const userGetRoutes = express.Router();

const allRoutes = [
  {
    name: getUserData,
    auth: true,
    rout: "/user-data",
  },
  {
    name: userNotification,
    auth: true,
    rout: "/user-notification",
  },
  //
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout.length >= 2) {
      userGetRoutes.use(`/get/user${rout}/:token`, AuthToken, name);
    } else {
      userGetRoutes.use("/", verifyUser, name);
    }
  } else {
    if (rout.length >= 2) {
      userGetRoutes.use(`/get/user/${rout}`, name);
    } else {
      userGetRoutes.use("/", name);
    }
  }
});

export default userGetRoutes;
