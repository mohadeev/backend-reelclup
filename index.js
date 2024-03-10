import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./db/dbConnect.js";
import Routes from "./routes/routes.js";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN;
console.log(ORIGIN);
dotenv.config();
cors(
  { "Access-Control-Allow-Origin": "*" },
  "Access-Control-Allow-Methods: POST, PUT, PATCH, GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers: Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
);

dbConnect();

app.use(cookieParser());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" },
// });
// concect app
// io.on("connection", (socket) => {
//   socketFuncs(io, socket);
// });
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", `*`);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS,  PUT,PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, scrolling, a_custom_header"
  );
  // res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/", Routes);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server running on Port ", PORT);
  }
});

// getUserCountryAndCities();
