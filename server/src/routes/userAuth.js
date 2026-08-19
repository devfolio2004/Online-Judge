import express from "express";
const authRouter = express.Router();
import { register, login, logout } from "../controllers/userAuthent.js";
import authMiddleware from "../middleware/authMidlleware.js";

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
// authRouter.get("/myProfile", myProfile);

export default authRouter;
