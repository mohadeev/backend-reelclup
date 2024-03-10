import express from "express";
import User from "../../../db/schema/userModel.js";
import channelModal from "../../../db/schema/channelModel.js";
import mongoose from "mongoose";
import resErrorFunc from "../../../utils/resErrorFunc.js";
import verifyUpdates from "./verifyUpdates.js";
const updateAccountData = express.Router();

updateAccountData.post("/", async (req, res) => {
  const userId = req.userId;
  const bodyData = req.body.accountData;
  User.findOne({ _id: userId }).then(async (docadded) => {
    if (typeof docadded !== "undefined") {
      console.log("bodyData", bodyData);
      verifyUpdates(res, userId, bodyData, docadded);
    }
  });
});

export default updateAccountData;
