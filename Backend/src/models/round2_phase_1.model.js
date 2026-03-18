import mongoose from "mongoose";

const round2QuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      unique: true,
    },  
    
    year: {
      type: Number,
      required: true
    },

    order: {
      type: Number,
      required: true
    },

    question: {
      type: String,
      required: true
    },

    options: {
      type: [String],
      required: true
    },

    correctAnswer: {
      type: String,
      required: true
    },

    tokenReward: {
      type: Number,
      default: 10
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Round2Question", round2QuestionSchema);