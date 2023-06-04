import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
import createLiveStream from "./createLiveStream.js";
import submitStream from "./submitStream.js";
const stream = express.Router();

const allStreams = [];
stream.post(
  "/post/stream/create-live-stream/:token",
  AuthToken,
  async (req, res) => {
    await createLiveStream(req, res);
  }
);
stream.post(
  "/post/stream/submite-live-stream/:token",
  AuthToken,
  async (req, res) => {
    await submitStream(req, res);
  }
);

export default stream;
