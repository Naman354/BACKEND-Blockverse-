import Round1Question from "../models/Round_1_questions.model.js";
import Round1Progress from "../models/Round1_progress.model.js";
import Team from "../models/team.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { emitLeaderboard } from "../utils/emitLeaderboard.js";
import { calculateTeamScore } from "../utils/calculateScore.js";

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
    .select("questionId order question options pointReward year");

  return res.json(
    new ApiResponse(200, {
      totalQuestions: questions.length,
      solvedCount: progress.solvedQuestions.length,
      questions,
    }),
  );
});

export const submitRound1Answer = asyncHandler(async (req, res) => {
  const teamId = req.user._id;
  const { questionId, selectedOption } = req.body;

  if (!questionId || selectedOption === undefined || selectedOption === null) {
    throw new ApiError(400, "Question ID and correct option is required");
  }

  const question = await Round1Question.findOne({ questionId }).select(
    "+correctAnswer +pointReward",
  );

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
  const correct = question.correctAnswer.trim().toLowerCase();
  const selected = selectedOption.trim().toLowerCase();

  if (correct !== selected) {
    return res.json(
      new ApiResponse(200, { correct: false }, "Incorrect answer"),
    );
  }

  progress.solvedQuestions.push(questionId);
  if (progress.solvedQuestions.length === 50) {
    progress.completed = true;
  }

  await progress.save();

  await emitLeaderboard(req);

  res.json(new ApiResponse(200, { points: question.pointReward }, "Correct"));
});

export const getRound1Progress = asyncHandler(async (req, res) => {
  const teamId = req.user._id;

  const progress = await Round1Progress.findOne({ teamId });

  if (!progress) {
    return res.json(
      new ApiResponse(200, { solved: [], score: 0 }, "No progress yet"),
    );
  }

  const score = await calculateTeamScore(teamId);

  return res.json(
    new ApiResponse(
      200,
      {
        solved: progress.solvedQuestions,
        score,
      },
      "Round 1 progress",
    ),
  );
});
