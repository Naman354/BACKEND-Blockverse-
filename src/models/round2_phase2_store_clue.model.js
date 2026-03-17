import mongoose from "mongoose";

const round2ClueSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true
    },

    clueId: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    tokenCost: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Round2Clue", round2ClueSchema);