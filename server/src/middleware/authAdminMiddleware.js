import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import crypto from "node:crypto";
import "dotenv/config";

const authAdminMiddleware = async (req, res, next) => {
  try {
    const { tokenName } = req.cookies;
    if (!tokenName) {
      throw new Error("Unauthorized");
    }
    const payload = jwt.verify(tokenName, process.env.JWT_SECRET_KEY);
    const { _id, role } = payload;
    if (!_id || role !== "admin") {
      throw new Error("Unauthorized");
    }
    const tokenHash = crypto
      .createHash("sha256")
      .update(tokenName)
      .digest("hex");
    const isBlocked = await redisClient.exists(`blockedToken:${tokenHash}`);
    if (isBlocked) {
      throw new Error("Unauthorized");
    }
    req.user = payload;
    req.token = tokenName;
    next();
  } catch (err) {
    console.log(`Error:${err.message}`);
    res.status(401).json({
      Error: "Unauthorized",
    });
  }
};

export default authAdminMiddleware;
