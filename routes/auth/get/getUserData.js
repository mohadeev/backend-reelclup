import express from "express";
import mongoose from "mongoose";
import userModel from "../../../db/schema/userModel.js";
const getUserData = express.Router();

getUserData.get("/", async (req, res) => {
  const reqUserId = req.userId;
  var converData = [];
  if (mongoose.Types.ObjectId.isValid(reqUserId)) {
    await userModel.findOne({ _id: reqUserId }).then(async (userVerfied) => {
      res.json({ responseData: { userData: userVerfied } });
    });
  }
});

// converData.sort(
//   (x, y) =>
//     -new Date(x.lastmessage.createdAt) -
//     -new Date(y.lastmessage.createdAt)
// );
export default getUserData;
