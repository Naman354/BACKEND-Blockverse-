import asyncHandler from "../utils/asyncHandler.js";
export const startRound2Phase1Question = asyncHandler(async (req, res) => {
  const teamId = req.user._id;
  const { questionId } = req.body;

  if (!questionId) {
    throw new ApiError(400, "Question ID required");
  }

  const progress =
    (await Round2Progress.findOne({ teamId })) ||
    (await Round2Progress.create({ teamId }));

    if (progress.solvedQuestions.includes(questionId)) {
  throw new ApiError(400, "Question already solved");
}

  // Prevent starting new question if one is active
  if (progress.activeQuestion) {
    throw new ApiError(400, "Another question is already active");
  }

  progress.activeQuestion = {
    questionId,
    startedAt: new Date(),
  };

  await progress.save();

  return res.json(
    new ApiResponse(200, null, "Timer started for question")
  );
});
