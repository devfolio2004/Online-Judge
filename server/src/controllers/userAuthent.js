import userModel from "../models/user.js";
import validate from "../utils/validate.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import crypto from "node:crypto";

export const register = async (req, res) => {
  try {
    //validate the data filled by the user at the time of registering:
    const { firstName, lastName, userName, email, password, age } = req.body;
    if (!firstName || !lastName || !userName || !email || !password) {
      throw new Error("Required fields are missing!");
    }
    validate(req.body);
    //If data is valid,hashing of password:
    const hashedPassword = await bcrypt.hash(password, 10);
    //Now save the user data in the collection:
    const user = await userModel.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      age,
    });
    //At the time of register only give an access token to the user:
    const accessToken = jwt.sign(
      { _id: user._id, email: email, role: "user" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "20m" },
    );
    res.cookie("tokenName", accessToken, {
      maxAge: 60 * 20 * 1000,
      httpOnly: true,
    });
    res.status(201).send("Registered Successfully!");
  } catch (err) {
    res.status(400).json({ "Error:": err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Email and password are required!");
    }
    const userData = await userModel
      .findOne({ email: email })
      .select("+password");
    if (!userData) {
      throw new Error("Invalid Credentials!");
    }
    const isAllowed = await bcrypt.compare(password, userData.password);
    if (!isAllowed) {
      throw new Error("Invalid Credentials!");
    }
    const accessToken = jwt.sign(
      { _id: userData._id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "20m" },
    );
    res.cookie("tokenName", accessToken, {
      maxAge: 60 * 20 * 1000,
      httpOnly: true,
    });
    res.status(201).send("Logged in Successfully!");
  } catch (err) {
    res.status(400).json({ "Error: ": err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const tokenName = req.token;
    const payload = req.user;
    const tokenHash = crypto
      .createHash("sha256")
      .update(tokenName)
      .digest("hex");
    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    await redisClient.set(`blockedToken:${tokenHash}`, "Blocked", { EX: ttl });
    res.clearCookie("tokenName", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.send("Logged out successfully!");
  } catch (err) {
    res.status(401).json({ "Error: ": err.message });
  }
};

export const promoteToAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("Email is required");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.role === "admin") {
      throw new Error("User is already an admin");
    }
    user.role = "admin";
    await user.save();
    res.status(200).send(`${user.userName} is now an admin.`);
  } catch (err) {
    res.status(400).json({
      "Error ": err.message,
    });
  }
};
