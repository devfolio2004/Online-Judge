import userModel from "../models/user.js";
import validate from "../utils/validate.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    //validate the data filled by the user at the time of registering:
    const { firstName, lastName, userName, emailId, password, age } = req.body;
    validate(req.body);
    //If data is valid,hashing of password:
    const hashedPassword = await bcrypt.hash(password, 10);
    //Now save the user data in the collection:
    const user = await userModel.create({
      firstName,
      lastName,
      userName,
      emailId,
      password: hashedPassword,
      age,
    });
    //At the time of register only give an access token to the user:
    const accessToken = jwt.sign(
      { id: user._id, emailId: emailId },
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
