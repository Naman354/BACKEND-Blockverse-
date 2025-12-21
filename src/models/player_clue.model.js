import mongoose from "mongoose";
import Team from "./team.model.js";

const playerClueSchema = new mongoose.Schema(
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

playerClueSchema.index({ playerId: 1, clueId: 1 }, { unique: true });

const PlayerClue = mongoose.model("PlayerClue", playerClueSchema);
export default PlayerClue;
