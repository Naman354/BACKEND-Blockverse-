import Team from "../models/team.model.js";

export const emitLeaderboard = async (req) => {
  try {
    if (!req.io) return;

    const teams = await Team.find()
      .sort({ totalPoints: -1, createdAt: 1 })
      .select("teamId totalPoints");

    req.io.to("leaderboard").emit("leaderboard:update", teams);
  } catch (error) {
    console.error("Leaderboard emit error:", error.message);
  }
};
