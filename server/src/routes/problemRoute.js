import express from "express";
const problemRouter = express.Router();
import authUserMiddleware from "../middleware/authUserMidlleware.js";
import authAdminMiddleware from "../middleware/authAdminMiddleware.js";
import { createProblem, updateProblem } from "../controllers/problemControl.js";

problemRouter.post("/create", authAdminMiddleware, createProblem);
// problemRouter.get("/fetchall", authUserMiddleware, fetchAllProblems);
// problemRouter.get("/fetch/:id", authUserMiddleware, fetchOneProblem);
problemRouter.patch("/update/:id", authAdminMiddleware, updateProblem);
// problemRouter.delete("/delete/:id", authAdminMiddleware, deleteProblem);
// problemRouter.get("/fetchProblems/user", authUserMiddleware, userProblems);

export default problemRouter;
