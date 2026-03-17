import mongoose from "mongoose";

const round1ProgressSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },

  status: {
    type: String,
    default: "IN_PROGRESS",
  },

  startedAt: {
    type: Date,
    default: Date.now,
  },

  endedAt: Date,

  questions: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      questionText: String,
      options: [String],
      points: Number,
      solved: { type: Boolean, default: false },
      attempts: { type: Number, default: 0 },
    },
  ],

  scoreAdded: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Round1Progress", round1ProgressSchema);
