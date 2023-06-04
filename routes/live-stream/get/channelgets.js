// import express from "express";
// import AuthToken from "../../../utils/verify-user/VerifyUser.js";
// import allChannels from "./allChannels.js";
// import channelPage from "./channelPage.js";
// const routesChannelGet = express.Router();

// const allRoutes = [
//   {
//     name: allChannels,
//     auth: true,
//     rout: "/all-channels",
//   },
//   {
//     name: channelPage,
//     auth: false,
//     rout: "",
//   },
// ];

// allRoutes.map(({ name, auth, rout }) => {
//   if (auth) {
//     routesChannelGet.use(`/get/channel${rout}:token`, AuthToken, name);
//   } else {
//     if (rout !== "") {
//       routesChannelGet.use(`/get/channel${rout}`, name);
//     } else {
//       routesChannelGet.use(`/`, name);
//     }
//   }
// });

// export default routesChannelGet;
