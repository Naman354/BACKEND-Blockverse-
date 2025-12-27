const ROUND3_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const MAX_MISTAKES_PER_BOMB = 1; // configurable

import Round3Question from "../models/round3/round3QuestionModel.model.js";
import Round3Progress from "../models/round3Progress.model.js";
import Team from "../models/team.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const initRound3 = asyncHandler(async (requestAnimationFrame, res) => {
    const teamId = requestAnimationFrame.teamId;

    if (!teamId) {
         throw new ApiError(401, "Unauthorized");
    }

    let progress = await Round3Progress.findOne({ teamId});

    if (!progress) {
        const questions = await Round3Question.find().selecr(
            "_id bombNumber questionNumber questionText points" 
        );
        
    if (!questions.length) {
        throw new ApiError(500, "Round 3 questions not configured");
    }

    const bombMap = {};
    for (const q of questions) {
        if (!bpmpbsMap[q.bombNumber]) {
            bombsMap[q.bombNumber] = {
                bombNumber: q.bombNumber,
                mistakes: 0,
                questions: [],
            };
        }

        bombsMap[q.bombNumber].questions.push({
            questionId: q._id,
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

    const elapsed = Date.now() - progress.startedAt.getTime();
    const remainingTime = Math.max(ROUND3_DURATION_MS - elapsed, 0);

    if (reaminingTime === 0) {
        progress.status = "TIME_UP";
        progress.endedAt = new Date();
        await progress.save();

        return res.json(
            new ApiResponse(200, { status: "TIME_UP" }, "Time expired")
        );
    }

    const team = await Team.findById(teamId).select("year");
    if (!team) {
        throw new ApiError(404, "Team not found");
    }

    const questions = await Round3Question.find({ year: team.year }).select(
        "_id bombNumber questionNumber questionText points"
    );


    return res.json(
        new ApiResponse(200, {
            status: progress.status,
            timeRemainingMs: remainingTime,
            bombs: progress.bombs,
            questions,
        })
    );
});