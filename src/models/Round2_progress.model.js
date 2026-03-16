import mongoose from "mongoose";

const questionProgressSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },

  questionText: String,

  options: [String],

  tokenReward: Number,

  solved: {
    type: Boolean,
    default: false
  },

  attempts: {
    type: Number,
    default: 0
  }
},
{ _id: false });

const round2ProgressSchema = new mongoose.Schema(
{
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },

  status: {
    type: String,
    enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "TIME_UP"],
    default: "NOT_STARTED"
  },

  phase: {
    type: Number,
    default: 1
  },

  tokens: {
    type: Number,
    default: 0
  },

  questions: [questionProgressSchema],

  solvedQuestions: [
    {
      type: String
    }
  ],

  purchasedClues: [
    {
      type: String
    }
  ],

  storeUnlocked: {
    type: Boolean,
    default: false
  },

  startedAt: Date,

  endedAt: Date
},
{
  timestamps: true
}
);

export default mongoose.model("Round2Progress", round2ProgressSchema);