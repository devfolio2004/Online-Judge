import express from "express";
const authRouter = express.Router();
import { register } from "../controllers/userAuthent.js";

authRouter.post("/register", register);
// authRouter.post("/login", login);
// authRouter.post("/logout", logout);
// authRouter.get("/myProfile", myProfile);

export default authRouter;
