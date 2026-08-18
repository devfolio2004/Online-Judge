import mongoose from "mongoose";
const { Schema } = mongoose;
import validator from "validator";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 12,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 12,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter a valid Email!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      state: false,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter a strong password!");
        }
      },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    age: {
      type: Number,
      min: 6,
      max: 80,
    },
    problemsSolved: {
      type: [String],
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
