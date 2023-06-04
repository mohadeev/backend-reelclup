import express from "express";
import userGetRoutes from "./get/userGetRoutes.js";
import authPosts from "./post/authPosts.js";
import routerSignIn from "./signin/signin.js";
import routerSignUp from "./signup/signup.js";

const routesAuth = express.Router();

routesAuth.use("/auth/sign-in", routerSignIn);
routesAuth.use("/auth/sign-up", routerSignUp);
routesAuth.use("/", userGetRoutes);
routesAuth.use("/", authPosts);
export default routesAuth;
//DF
