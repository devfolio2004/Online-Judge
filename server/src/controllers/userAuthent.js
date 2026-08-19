import userModel from "../models/user.js";
import validate from "../utils/validate.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      { id: user._id, email: email },
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
      { id: userData._id, email: userData.email },
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
