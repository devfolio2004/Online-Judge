import express from "express";
import cookieParser from "cookie-parser";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

export default app;
