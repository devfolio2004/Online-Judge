import express from "express";
const authRouter = express.Router();
import {
  register,
  login,
  logout,
  promoteToAdmin,
} from "../controllers/userAuthent.js";
import authUserMiddleware from "../middleware/authUserMidlleware.js";
import authAdminMiddleware from "../middleware/authAdminMiddleware.js";

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authUserMiddleware, logout);
authRouter.post("/admin/register", authAdminMiddleware, promoteToAdmin);
// authRouter.get("/myProfile", myProfile);

export default authRouter;
