import mongoose from "mongoose";

const roundProgressSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },

    roundId: {
      type: Number,
      default: 2,
    },

    phase: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },

    solvedQuestions: [
      {
        type: String, // questionId
      },
    ],

    tokensEarned: {
      type: Number,
      default: 0,
    },

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

const RoundProgress = mongoose.model("RoundProgress", roundProgressSchema);
export default RoundProgress;
