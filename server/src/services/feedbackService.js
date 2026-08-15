import { Feedback, Problem } from '../models/index.js';

export const submitFeedback = async ({
  problemId,
  userId,
  difficultyPerception,
  qualityRating,
  category,
  comment
}) => {
  const existing = await Feedback.findOne({ problemId, userId });
  if (existing) {
    existing.difficultyPerception = difficultyPerception;
    existing.qualityRating = qualityRating;
    existing.category = category;
    existing.comment = comment;
    await existing.save();
    return existing;
  }

  const feedback = await Feedback.create({
    problemId,
    userId,
    difficultyPerception,
    qualityRating,
    category,
    comment
  });

  return feedback;
};

export const getProblemFeedbackStats = async (problemId) => {
  const feedbacks = await Feedback.find({ problemId });
  const count = feedbacks.length;
  if (count === 0) {
    return {
      totalFeedback: 0,
      averageQuality: 0,
      difficultyDistribution: {
        TOO_EASY: 0,
        EASY: 0,
        APPROPRIATE: 0,
        HARD: 0,
        TOO_HARD: 0
      }
    };
  }

  const sumQuality = feedbacks.reduce((acc, f) => acc + f.qualityRating, 0);
  const diffDist = { TOO_EASY: 0, EASY: 0, APPROPRIATE: 0, HARD: 0, TOO_HARD: 0 };
  feedbacks.forEach(f => {
    if (diffDist[f.difficultyPerception] !== undefined) {
      diffDist[f.difficultyPerception]++;
    }
  });

  return {
    totalFeedback: count,
    averageQuality: (sumQuality / count).toFixed(1),
    difficultyDistribution: diffDist
  };
};
