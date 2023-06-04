import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import deleteChannel from "./deleteChannel.js";
const routesChannelDeletes = express.Router();

const allRoutes = [
  {
    name: deleteChannel,
    auth: true,
    rout: "/delete-channel/",
  },
];

allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    routesChannelDeletes.use(`/delete/channel${rout}:token`, AuthToken, name);
  } else {
    routesChannelDeletes.use(`/delete/channel${rout}:token`, name);
  }
});

export default routesChannelDeletes;
