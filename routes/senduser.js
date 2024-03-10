import express from "express";
import mongoose from "mongoose";
import User from "../db/schema/userModel.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let users = await User.find({});
    users.map((object) => {
      object.password = "";
    });
    res.status(200).json({ data: users });
  } catch (err) {
    res.json(err);
  }
});

export default router;
