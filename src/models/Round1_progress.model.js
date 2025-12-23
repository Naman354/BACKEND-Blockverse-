import mongoose from "mongoose";

const round1ProgressSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      unique: true,
    },
    solvedQuestions: [String],
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Round1Progress", round1ProgressSchema);
