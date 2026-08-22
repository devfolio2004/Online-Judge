import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/userAuth.js";
import problemRouter from "./routes/problemRoute.js";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());
//Route for user authentication:
app.use("/auth", authRouter);
//Route for problems:
app.use("/problems", problemRouter);

export default app;
