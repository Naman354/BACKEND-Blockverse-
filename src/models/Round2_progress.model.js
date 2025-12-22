import mongoose from "mongoose";

const round2ProgressSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      unique: true,
    },

    phase: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },
    solvedQuestions: [String],
    tokens: {
      type: Number,
      default: 0,
    },
    purchasedClues: [String],

    phase1Completed: {
      type: Boolean,
      default: false,
    },
    storeUnlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Round2Progress", round2ProgressSchema);
