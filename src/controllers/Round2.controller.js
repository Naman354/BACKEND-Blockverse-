import Round2Question from "../models/round2_phase_1.model.js";
import Round2Progress from "../models/Round2_progress.model.js";
import Team from "../models/team.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
// import { emitLeaderboard } from "../utils/emitLeaderboard.js";

export const getRound2Phase1Questions = asyncHandler(async (req, res) => {
  const teamId = req.user._id;

  const progress =
    (await Round2Progress.findOne({ teamId })) ||
    (await Round2Progress.create({ teamId }));

  if (progress.phase !== 1) {
    throw new ApiError(403, "Phase 1 completed");
  }

  const questions = await Round2Question.find()
    .sort({ order: 1 })
    .select("questionId order question tokenReward");

  return res.json(
    new ApiResponse(200, {
      solvedCount: progress.solvedQuestions.length,
      tokens: progress.tokens,
      questions,
    })
  );
});

export const submitRound2Phase1Answer = asyncHandler(async (req, res) => {
  const teamId = req.user._id;
  const { questionId, answer } = req.body;

  if (!questionId || !answer) {
    throw new ApiError(400, "Question ID and answer required");
  }

  const question = await Round2Question.findOne({ questionId }).select(
    "+correctAnswer"
  );
  if (!question) throw new ApiError(404, "Question not found");

  const progress =
    (await Round2Progress.findOne({ teamId })) ||
    (await Round2Progress.create({ teamId }));

  if (progress.solvedQuestions.includes(questionId)) {
    return res.json(new ApiResponse(200, null, "Already solved"));
  }

  if (question.correctAnswer !== answer.toLowerCase()) {
    throw new ApiError(400, "Incorrect answer");
  }

  progress.solvedQuestions.push(questionId);
  progress.tokens += question.tokenReward;

  if (progress.solvedQuestions.length === 20) {
    progress.phase = 2;
    progress.phase1Completed = true;
    progress.storeUnlocked = true;
  }

  await progress.save();

  await Team.findByIdAndUpdate(teamId, {
    $inc: { totalPoints: 5 },
  });

  // await emitLeaderboard(req);

  return res.json(
    new ApiResponse(
      200,
      {
        tokens: progress.tokens,
        storeUnlocked: progress.storeUnlocked,
      },
      "Correct answer"
    )
  );
});

export const getStoreClues = asyncHandler(async (req, res) => {
  const teamId = req.user._id;

  const progress = await Round2Progress.findOne({ teamId });

  if (!progress || !progress.storeUnlocked) {
    throw new ApiError(403, "Store is locked. Complete Phase 1 first.");
  }

  const allClues = await StoreClue.find().select(
    "clueId title description tokenCost"
  );

  const ownedClues = await TeamClue.find({ teamId }).distinct("clueId");

  const availableClues = allClues.filter(
    (clue) => !ownedClues.includes(clue.clueId)
  );

  return res.json(
    new ApiResponse(
      200,
      {
        tokensAvailable: progress.tokens,
        availableClues,
      },
      "Store clues fetched"
    )
  );
});

export const buyClue = asyncHandler(async (req, res) => {
  const teamId = req.user._id;
  const { clueId } = req.body;

  if (!clueId) {
    throw new ApiError(400, "Clue ID is required");
  }

  const progress = await Round2Progress.findOne({ teamId });

  if (!progress || !progress.storeUnlocked) {
    throw new ApiError(403, "Store is locked");
  }

  const clue = await StoreClue.findOne({ clueId });

  if (!clue) {
    throw new ApiError(404, "Clue not found");
  }

  const alreadyOwned = await TeamClue.findOne({ teamId, clueId });
  if (alreadyOwned) {
    throw new ApiError(409, "Clue already purchased");
  }

  if (progress.tokens < clue.tokenCost) {
    throw new ApiError(400, "Insufficient tokens");
  }

  progress.tokens -= clue.tokenCost;
  await progress.save();

  await TeamClue.create({
    teamId,
    clueId,
  });

  return res.json(
    new ApiResponse(
      200,
      {
        remainingTokens: progress.tokens,
        purchasedClue: {
          clueId: clue.clueId,
          title: clue.title,
        },
      },
      "Clue purchased successfully"
    )
  );
});
