import express from "express";
import mongoose from "mongoose";
import User from "../../../../db/schema/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createuser = async (req, res) => {
  const { password, conifirmpassword, username } = req.body;
  const email = req?.body?.email.trim();
  if (
    !email.includes("@") ||
    email.length <= 0 ||
    email.length > 40 ||
    email.includes("http:") ||
    email.includes("https:")
  ) {
    res.json({
      message: "RandomTextNotEmailAdress",
    });
  } else if (password.length <= 7) {
    res.json({
      message: "ShortPassWord",
    });
  } else if (password != conifirmpassword) {
    res.json({
      message: "PasswordNotMatch",
    });
  } else {
    await User.findOne({ email: email }).then((doc) => {
      if (doc) {
        res.json({
          message: "AvalibleEmail",
        });
      } else if (!doc) {
        const CreateUser = async () => {
          const salt = await bcrypt.genSalt();
          const hashPassword = await bcrypt.hash(password, salt);
          User.create({ email: email, password: hashPassword, username }).then(
            (docadded) => {
              const id = docadded._id.toString("hex");
              const accessToken = jwt.sign(id, process.env.ACCESS_TOKEN_SECRET);
              const user = { email: email, accessToken: accessToken };
              if (!req.user) {
                req.user = { email, userId: id };
              }
              res.json({
                message: "user created successfully",
                user: user,
                userData: docadded,
              });
            }
          );
        };
        CreateUser();
      }
    });
  }
};

export default createuser;
