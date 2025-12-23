import mongoose from "mongoose";

const Round2QuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      unique: true,
    },

    year: {
      type: Number,
      enum: [1, 2],
      required: true,
    },

    phase: {
      type: Number,
      default: 1,
    },

    order: {
      type: Number,
    },

    question: {
      type: String,
      required: true,
    },

    correctAnswer: {
      type: String,
      required: true,
      select: false,
      lowercase: true,
    },

    tokenReward: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Round2Question = mongoose.model("Round2Questions", Round2QuestionSchema);
export default Round2Question;
