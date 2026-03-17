import Round1Progress from "../models/Round1_progress.model.js";
import Round1Question from "../models/Round_1_questions.model.js";
import Round2Progress from "../models/Round2_progress.model.js";

export const calculateTeamScore = async (teamId) => {
  let score = 0;

  const r1 = await Round1Progress.findOne({ teamId });

  if (r1) {
    const q = await Round1Question.find({
      questionId: { $in: r1.solvedQuestions },
    }).select("pointReward");

    q.forEach((ques) => (score += ques.pointReward));
  }

  const r2 = await Round2Progress.findOne({ teamId });

  if (r2) {
    score += r2.tokens;
  }

  return score;
};
