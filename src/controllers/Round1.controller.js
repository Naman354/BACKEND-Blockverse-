import Round1Question from "../models/Round_1_questions.model.js";
import Round1Progress from "../models/Round1_progress.model.js";
import Team from "../models/team.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { emitLeaderboard } from "../utils/emitLeaderboard.js";

export const getRound1Questions = asyncHandler(async (req, res) => {
  const teamId = req.user._id;

  const team = await Team.findById(teamId).select("year");
  if (!team) {
    throw new ApiError(404, "Team not Found");
  }

  const progress =
    (await Round1Progress.findOne({ teamId })) ||
    (await Round1Progress.create({ teamId }));

  const questions = await Round1Question.find({
    year: team.year,
  })
    .sort({ order: 1 })
    .select("questionId order question pointReward");

  return res.json(
    new ApiResponse(200, {
      totalQuestions: questions.length,
      solvedCount: progress.solvedQuestions.length,
      questions,
    })
  );
});

export const submitRound1Answer = asyncHandler(async (req, res) => {
  const teamId = req.user._id;
  const { questionId, answer } = req.body;

  if (!questionId || !answer) {
    throw new ApiError(400, "Question ID and answer are required");
  }

  const question = await Round1Question.findOne({
    questionId,
  }).select("+correctAnswer");

  if (!question) {
    throw new ApiError(404, "Round 1 question not found");
  }

  let progress = await Round1Progress.findOne({ teamId });
  if (!progress) {
    progress = await Round1Progress.create({ teamId });
  }

  if (progress.solvedQuestions.includes(questionId)) {
    return res.json(new ApiResponse(200, null, "Already solved"));
  }
  const normalizedAnswer = answer.trim().toLowerCase();

  if (question.correctAnswer !== normalizedAnswer) {
    throw new ApiError(400, "Incorrect Answer");
  }

  progress.solvedQuestions.push(questionId);

  if (progress.solvedQuestions.length === 50) {
    progress.completed = true;
  }

  await progress.save();

  await Team.findByIdAndUpdate(teamId, {
    $inc: { totalPoints: question.pointReward },
    $set: { "rounds.round1Completed": progress.completed },
  });

  await emitLeaderboard(req);

  res.json(new ApiResponse(200, { points: question.pointReward }, "Correct"));
});
