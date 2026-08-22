import mongoose from "mongoose";
const { Schema } = mongoose;

const visibleTestCaseSchema = new Schema({
  input: {
    type: String,
    required: true,
    trim: true,
  },
  output: {
    type: String,
    required: true,
    trim: true,
  },
  explanation: {
    type: String,
    required: true,
    trim: true,
  },
});

const hiddenTestCaseSchema = new Schema({
  input: {
    type: String,
    required: true,
    trim: true,
  },
  output: {
    type: String,
    required: true,
    trim: true,
  },
});

const boilerPlateSchema = new Schema({
  language: {
    type: String,
    required: true,
    enum: ["C++", "Java", "JavaScript", "Python"],
  },
  initialCode: {
    type: String,
    required: true,
  },
});

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
      trim: true,
    },
    tags: [
      {
        type: String,
        enum: [
          "Array",
          "Graph Theory",
          "Tree",
          "Linked List",
          "Dynamic Programming",
          "Stack",
          "Queue",
          "Binary Search",
          "Two Pointers",
        ],
        trim: true,
      },
    ],
    visibleTestCases: {
      type: [visibleTestCaseSchema],
      required: true,
    },
    hiddenTestCases: {
      type: [hiddenTestCaseSchema],
      required: true,
    },
    boilerPlate: {
      type: [boilerPlateSchema],
      required: true,
    },
    problemCreator: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    editorialCode: [
      {
        language: {
          type: String,
          required: true,
          enum: ["C++", "Java", "JavaScript", "Python"],
        },
        completeCode: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const problemModel = mongoose.model("problem", problemSchema);
export default problemModel;
