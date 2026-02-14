const ROUND3_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const MAX_MISTAKES_PER_BOMB = 2; // reserved for submit logic

// simple check for deploy

import Round3Question from "../models/round3/round3Question.model.js";
import Round3Progress from "../models/round3/round3Progress.model.js";
import Team from "../models/team.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const initRound3 = asyncHandler(async (req, res) => {
  const teamId = req.teamId;

  if (!teamId) {
    throw new ApiError(401, "Unauthorized");
  }

  let progress = await Round3Progress.findOne({ teamId });

  if (!progress) {
  const team = await Team.findById(teamId).select("year");
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  const questions = await Round3Question.find({ year: team.year }).select(
    "_id bombNumber questionNumber questionText options points"
  );

  if (!questions.length) {
    throw new ApiError(500, "Round 3 questions not configured");
  }

  const bombsMap = {};

  for (const q of questions) {
    if (!bombsMap[q.bombNumber]) {
      bombsMap[q.bombNumber] = {
        bombNumber: q.bombNumber,
        mistakes: 0,
        questions: [],
      };
    }

    bombsMap[q.bombNumber].questions.push({
      questionId: q._id,
      questionNumber: q.questionNumber,
      questionText: q.questionText,
      options: q.options, // ✅ now included properly
      points: q.points,
      solved: false,
      attempts: 0,
    });
  }

  progress = await Round3Progress.create({
    teamId,
    status: "IN_PROGRESS",
    startedAt: new Date(),
    bombs: Object.values(bombsMap),
    scoreAdded: 0,
  });
}


  // const elapsed = Date.now() - progress.startedAt.getTime();
  // const remainingTime = Math.max(ROUND3_DURATION_MS - elapsed, 0);

  // if (remainingTime === 0 && progress.status !== "TIME_UP") {
  //   progress.status = "TIME_UP";
  //   progress.endedAt = new Date();
  //   await progress.save();
  // }
  const remainingTime = ROUND3_DURATION_MS; // fake time for testing phase


  return res.json(
    new ApiResponse(200, {
      status: progress.status,
      timeRemainingMs: remainingTime,
      bombs: progress.bombs,
    })
  );
});
export const submitRound3Answer = asyncHandler(async (req, res) => {
  const teamId = req.teamId;
  const { bombNumber, questionNumber, answer } = req.body;

  if (!teamId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (
    bombNumber === undefined ||
    questionNumber === undefined ||
    !answer
  ) {
    throw new ApiError(400, "bombNumber, questionNumber and answer are required");
  }

  const progress = await Round3Progress.findOne({ teamId });
  if (!progress) {
    throw new ApiError(400, "Round 3 not initialized");
  }

  if (progress.status !== "IN_PROGRESS") {
    throw new ApiError(403, `Round is ${progress.status}`);
  }

  // const elapsed = Date.now() - progress.startedAt.getTime();
  // if (elapsed >= ROUND3_DURATION_MS) {
  //   progress.status = "TIME_UP";
  //   progress.endedAt = new Date();
  //   await progress.save();

  //   throw new ApiError(403, "Time expired");
  // }

  const bomb = progress.bombs.find(
    (b) => b.bombNumber === Number(bombNumber)
  );

  if (!bomb) {
    throw new ApiError(404, "Bomb not found");
  }

  const question = bomb.questions.find(
    (q) => q.questionNumber === Number(questionNumber)
  );

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  if (question.solved) {
    return res.json(
      new ApiResponse(200, { status: "ALREADY_SOLVED" }, "Already solved")
    );
  }

  const dbQuestion = await Round3Question.findById(question.questionId).select(
    "correctAnswer points"
  );

  if (!dbQuestion) {
    throw new ApiError(500, "Question data missing");
  }

  const normalizedAnswer = String(answer).trim().toUpperCase();

  if ( normalizedAnswer === String(dbQuestion.correctAnswer).trim().toUpperCase())
 {
    question.solved = true;

    progress.scoreAdded += dbQuestion.points;

    await Team.findByIdAndUpdate(teamId, {
      $inc: { totalPoints: dbQuestion.points },
    });

    await progress.save();

    return res.json(
      new ApiResponse(
        200,
        {
          correct: true,
          pointsAwarded: dbQuestion.points,
          totalRound3Score: progress.scoreAdded,
        },
        "Correct answer"
      )
    );
  }

  question.attempts += 1;
  bomb.mistakes += 1;

  if (bomb.mistakes > MAX_MISTAKES_PER_BOMB) {
    progress.status = "DISQUALIFIED";
    progress.endedAt = new Date();

    await progress.save();

    throw new ApiError(
      403,
      "Too many incorrect attempts. Team disqualified."
    );
  }

  await progress.save();

  throw new ApiError(400, "Incorrect answer");
});
