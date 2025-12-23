import mongoose from "mongoose";

const round2ClueSchema = new mongoose.Schema(
  {
    clueId: {
      type: String,
      unique: true,
    },

    year: {
      type: Number,
      enum: [1, 2],
      required: true,
    },

    title: String,
    description: String,

    tokenCost: {
      type: Number,
      default: 2,
    },
  },
  { timestamps: true }
);

const Round2Clues = mongoose.model("Round2Clue", round2ClueSchema);
export default Round2Clues;
