import mongoose from "mongoose";
import { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["C++", "Java", "JavaScript", "Python"],
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Wrong Answer",
        "Compilation Error",
        "Runtime Error",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
        "Internal Error",
      ],
      required: true,
      default: "Pending",
    },
    runtime: {
      type: Number,
      default: null,
      min: 0,
    },
    memory: {
      type: Number,
      default: null,
      min: 0,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    testCasesPassed: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
    totalTestCases: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

submissionSchema.index({ userId: 1, createdAt: -1 });

submissionSchema.index({
  userId: 1,
  problemId: 1,
  createdAt: -1,
});

const submissionModel = mongoose.model("submission", submissionSchema);
export default submissionModel;
