import mongoose from "mongoose";
import Team from "./team.model.js";

const teamClueSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    clueId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

teamClueSchema.index({ teamId: 1, clueId: 1 }, { unique: true });

const TeamClue = mongoose.model("TeamClue", teamClueSchema);
export default TeamClue;
