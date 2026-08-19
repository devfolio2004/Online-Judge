import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import crypto from "node:crypto";
import "dotenv/config";

const authMiddleware = async (req, res, next) => {
  try {
    const { tokenName } = req.cookies;
    if (!tokenName) {
      throw new Error("Unauthorized");
    }
    const payload = jwt.verify(tokenName, process.env.JWT_SECRET_KEY);
    req.user = payload;
    req.token = tokenName;
    const { _id } = payload;
    if (!_id) {
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
    next();
  } catch (err) {
    res.status(401).json({ "Error: ": err.message });
  }
};

export default authMiddleware;
