// import express from "express";
// import http from "http";
// import cors from "cors";
// import dotenv from "dotenv";
// import { Server, Socket } from "socket.io";
// import Routes from "./routes/routes.js";
// // import bodyParser from "body-parser";
// import dbConnect from "./db/dbConnect.js";
// // import cookieParser from "cookie-parser";
// import socketFuncs from "./socket/socketFuncs.js";
// import test from "./test.js";
// import renderVideo from "./live-funcs/video-handel/rendervideo.js";
// // import renderVideo from "./live-funcs/video-handel/rendervideo.js";
// // import testsFiles from "./testsFiles.js";

// // import session from "express-session";
// // testsFiles();
// //
// const app = express();
// const PORT = process.env.PORT || 5000;
// const ORIGIN = process.env.ORIGIN;
// const ORIGINWWW = process.env.ORIGINWWW;
// const ORIGINHTTP = process.env.ORIGINHTTP;
// const ORIGINHTTPWWW = process.env.ORIGINHTTPWWW;
// const ORIGINHTTPS = process.env.ORIGINHTTPS;
// const ORIGINHTTPSWWW = process.env.ORIGINHTTPSWWW;
// //
// // app.use(cookieParser());
// app.use(express.json());
// dbConnect();
// app.use(
//   cors({
//     origin: "*", // use your actual domain name (or localhost), using * is not recommended
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
//     credentials: true,
//   })
// );
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", true);
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   next();
// });
// const server = http.createServer(app);
// dotenv.config();

// const io = new Server(server, {
//   cors: {
//     origins: ["*"],
//   },
// });
// dotenv.config();

// io.on("connection", (socket) => {
//   socketFuncs(io, socket);
// });

// // (() => {
// //   setInterval(() => {
// //     renderVideo();
// //   }, 20000);
// //   renderVideo();
// // })();
// app.use("/", Routes);
// app.get("/", (req, res) => {
//   console.log("updated");
//   res.json("24");
// });
// app.use("/", test);
// dotenv.config();

// server.listen(PORT, (err) => {
//   if (err) console.log(err);
//   console.log("Server running on Port ", PORT);
// });

// dotenv.config();
console.log("SDSD");
