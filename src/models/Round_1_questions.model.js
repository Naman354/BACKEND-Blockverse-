import mongoose from "mongoose";

const round1QuestionSchema = new mongoose.Schema(
  {
    Round1questionId: {
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
    },

    pointReward: {
      type: Number,
      default: 10,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Round1Question = mongoose.model("Round_1_Question", round1QuestionSchema);
export default Round1Question;
