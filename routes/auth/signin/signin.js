import express from "express";
import mongoose from "mongoose";
const routerSignIn = express.Router();
import User from "../../../db/schema/userModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

routerSignIn.post("/", async (req, res) => {
  const { password, email } = req.body;
  await User.findOne({ email: email }).then((docadded) => {
    if (docadded) {
      bcrypt.compare(password, docadded.password).then((result) => {
        if (result) {
          const id = docadded._id.toString("hex");
          const accessToken = jwt.sign(id, process.env.ACCESS_TOKEN_SECRET);
          const user = { email: email, accessToken: accessToken };
          const reqUser = req.user;
          if (typeof reqUser === "undefined") {
            req.userId = id;
            req.userEmail = email;
          }
          res.json({
            message: "you successfully log in",
            user: user,
            userData: docadded,
          });
        } else {
          res.json({
            message: "WrongPassWord",
          });
        }
      });
    } else if (!docadded) {
      res.json({
        message: "EamilNotFinded",
      });
    }
  });
});

export default routerSignIn;
