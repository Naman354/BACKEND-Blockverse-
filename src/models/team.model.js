import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      enum: [1, 2],
      required: true,
    },

    members: [
      {
        name: { type: String, required: true },
        rollNo: { type: String, required: true },
        branch: { type: String, required: true },
        email: { type: String, required: true },
      },
    ],

    totalPoints: {
      type: Number,
      default: 0,
      index: true,
    },

    rounds: {
      round1Completed: { type: Boolean, default: false },
      round2Completed: { type: Boolean, default: false },
      round3Completed: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
