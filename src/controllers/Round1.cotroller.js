const ROUND1_DURATION_MS = 30 * 60 * 1000; // 30 minutes

import Round1Question from "../models/Round_1_questions.model.js";
import Round1Progress from "../models/Round1_progress.model.js";
import Team from "../models/team.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { emitLeaderboard } from "../utils/emitLeaderboard.js";
import { calculateTeamScore } from "../utils/calculateScore.js";

export const initRound1 = asyncHandler(async (req, res) => {
  const teamId = req.user?._id;
  if (!teamId) throw new ApiError(401, "Unauthorized");

  let progress = await Round1Progress.findOne({ teamId });

  if (!progress || !progress.questions || progress.questions.length === 0) {
    if (progress) {
      await Round1Progress.deleteOne({ teamId });
    }

    const team = await Team.findById(teamId).select("year");
    if (!team) throw new ApiError(404, "Team not found");

    const questions = await Round1Question.find({ year: team.year })
      .sort({ order: 1 })
      .select("_id question options pointReward");

    if (!questions.length)
      throw new ApiError(500, "Round 1 questions not configured");

    const formatted = questions.map((q) => ({
      questionId: q._id,
      questionText: q.question,
      options: q.options,
      points: q.pointReward,
      solved: false,
      attempts: 0,
    }));

    progress = await Round1Progress.create({
      teamId,
      status: "IN_PROGRESS",
      startedAt: new Date(),
      questions: formatted,
      scoreAdded: 0,
    });
  }

  const elapsed = Date.now() - new Date(progress.startedAt).getTime();
  const remainingTime = Math.max(ROUND1_DURATION_MS - elapsed, 0);

  if (remainingTime === 0 && progress.status !== "TIME_UP") {
    progress.status = "TIME_UP";
    progress.endedAt = new Date();
    await progress.save();
  }

  return res.json(
    new ApiResponse(200, {
      status: progress.status,
      timeRemainingMs: remainingTime,
      questions: progress.questions,
    }),
  );
});

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
  const teamId = req.user?._id;
  const { questionId, answer } = req.body;

  if (!teamId) throw new ApiError(401, "Unauthorized");
  if (!questionId || !answer)
    throw new ApiError(400, "questionId and answer required");

  const progress = await Round1Progress.findOne({ teamId });
  if (!progress) throw new ApiError(400, "Round 1 not initialized");

  if (progress.status !== "IN_PROGRESS")
    throw new ApiError(403, `Round is ${progress.status}`);

  const elapsed = Date.now() - new Date(progress.startedAt).getTime();
  if (elapsed >= ROUND1_DURATION_MS) {
    progress.status = "TIME_UP";
    progress.endedAt = new Date();
    await progress.save();
    throw new ApiError(403, "Time expired");
  }

  const question = progress.questions.find(
    (q) => q.questionId.toString() === questionId,
  );

  console.log("Questions...", question);

  if (!question) throw new ApiError(404, "Question not found");

  if (question.solved)
    return res.json(new ApiResponse(200, { status: "ALREADY_SOLVED" }));

  const dbQuestion = await Round1Question.findById(question.questionId).select(
    "correctAnswer pointReward",
  );

  const normalizedAnswer = String(answer).trim().toLowerCase();
  const correctAnswer = String(dbQuestion.correctAnswer).trim().toLowerCase();

  if (normalizedAnswer === correctAnswer) {
    question.solved = true;
    progress.scoreAdded += dbQuestion.pointReward;

    await Team.findByIdAndUpdate(teamId, {
      $inc: { totalPoints: dbQuestion.pointReward },
    });

    await progress.save();
    await emitLeaderboard(req);

    return res.json(
      new ApiResponse(
        200,
        {
          correct: true,
          pointsAwarded: dbQuestion.pointReward,
          totalRound1Score: progress.scoreAdded,
        },
        "Correct answer",
      ),
    );
  }

  question.attempts += 1;
  await progress.save();

  throw new ApiError(400, "Incorrect answer");
});

export const getRound1Progress = asyncHandler(async (req, res) => {
  const teamId = req.user._id;

  const progress = await Round1Progress.findOne({ teamId });

  if (!progress) {
    return res.json(
      new ApiResponse(200, { solved: [], score: 0 }, "No progress yet"),
    );
  }

  const solved = progress.questions
    .filter((q) => q.solved)
    .map((q) => q.questionId);
  const score = await calculateTeamScore(teamId);

  return res.json(
    new ApiResponse(
      200,
      {
        solved,
        score: progress.scoreAdded,
        status: progress.status,
      },
      "Round 1 progress",
    ),
  );
});
