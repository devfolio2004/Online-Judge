import express from "express";
import cookieParser from "cookie-parser";
import userModel from "./models/user.js";
import authRouter from "./routes/userAuth.js";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());
//Route for user authentication:
app.use("/auth", authRouter);

export default app;
