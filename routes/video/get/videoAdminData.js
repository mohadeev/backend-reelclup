import express from "express";
import mongoose from "mongoose";
// import channelModal from "../../../db/schema/channelModel.js";
// import userModel from "../../../db/schema/userModel.js";
const videoAdminData = express.Router();
import videoModel from "../../../db/schema/videoModel.js";
import https from "http";
import axios from "axios";
import jwt from "jsonwebtoken";
// import commentModel from "../../../db/schema/commentModel.js";
import * as cookie from "cookie";

videoAdminData.get("/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  //const
  videoModel.findOne({ _id: videoId }).then(async (video) => {
    console.log("video found", video?._id);
    res.json({ responseData: video });
  });
});

export default videoAdminData;
