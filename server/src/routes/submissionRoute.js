import express from "express";
const submissionRouter = express.Router();
import authUserMiddleware from "../middleware/authUserMidlleware.js";
import { saveSubmission } from "../controllers/submissionControl.js";

submissionRouter.post("/save/:id", authUserMiddleware, saveSubmission);

export default submissionRouter;
