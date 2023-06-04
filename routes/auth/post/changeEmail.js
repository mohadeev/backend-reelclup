import express from "express";
import User from "../../../db/schema/userModal.js";
import mongoose from "mongoose";
const changeEmail = express.Router();

changeEmail.post("/", async (req, res) => {
  const userId = req.userId;
  const email = req.body.email;
  console.log("here", userId, email);
  if (mongoose.Types.ObjectId.isValid(userId)) {
    await User.findOne({ _id: userId }).then(async (userDoc) => {
      console.log(userDoc, "user founeded");
      if (typeof userDoc !== "undefined") {
      } else if (userDoc) {
        res.json({
          message: "EamilNotFinded",
        });
      }
    });
  }
});

export default changeEmail;
