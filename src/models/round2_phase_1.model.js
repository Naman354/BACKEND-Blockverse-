import mongoose from "mongoose";

const Round2QuestionSchema = new mongoose.Schema(
  {
    Round2questionId: {
      type: String,
      required: true,
      unique: true,
    },

    round: {
      type: Number,
      default: 2,
    },

    phase: {
      type: Number,
      default: 1,
    },

    order: {
      type: Number,
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    correctAnswer: {
      type: String,
      required: true,
      select: false,
    },

    tokenReward: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Round2Question = mongoose.model(
  "Round_2_Questions",
  Round2QuestionSchema
);
export default Round2Question;
