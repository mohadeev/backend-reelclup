import express from "express";
const routerSignUp = express.Router();
import createuser from "./utils/createuser.js";

routerSignUp.post("/", async (req, res) => {
  createuser(req, res);
});

export default routerSignUp;
