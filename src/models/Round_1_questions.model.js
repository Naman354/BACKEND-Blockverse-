import mongoose from "mongoose";

const round1QuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      unique: true,
    },

    round: {
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
      lowercase: true,
    },

    pointReward: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

const Round1Question = mongoose.model("Round1Question", round1QuestionSchema);
export default Round1Question;
