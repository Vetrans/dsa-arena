import { Problem, Topic, UserProblem, User } from '../models/index.js';

export const getPersonalizedRecommendations = async (userId, limit = 5) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Fetch all user problem records
  const userProblems = await UserProblem.find({ userId }).populate({
    path: 'problemId',
    populate: { path: 'topics' }
  });

  const solvedProblemIds = new Set();
  const topicStats = {}; // { topicId: { name, slug, attempts, solved, totalProblems } }

  // Fetch all topics
  const allTopics = await Topic.find();
  allTopics.forEach(t => {
    topicStats[t._id.toString()] = {
      id: t._id,
      name: t.name,
      slug: t.slug,
      attempts: 0,
      solved: 0,
      totalProblems: t.problemCount || 0
    };
  });

  userProblems.forEach(up => {
    if (!up.problemId) return;
    if (up.status === 'SOLVED') {
      solvedProblemIds.add(up.problemId._id.toString());
    }

    if (up.problemId.topics) {
      up.problemId.topics.forEach(t => {
        const tId = t._id ? t._id.toString() : t.toString();
        if (topicStats[tId]) {
          topicStats[tId].attempts += up.attempts;
          if (up.status === 'SOLVED') {
            topicStats[tId].solved += 1;
          }
        }
      });
    }
  });

  // Calculate per-topic accuracy
  const topicPerformance = Object.values(topicStats).map(t => {
    const accuracy = t.attempts > 0 ? Math.round((t.solved / t.attempts) * 100) : 0;
    return {
      ...t,
      accuracy
    };
  });

  // Identify weak topics (topics attempted with lowest accuracy, or unattempted high-yield topics)
  const weakTopics = topicPerformance
    .filter(t => t.attempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy);

  let targetTopic = weakTopics[0];
  let recommendationReason = '';

  if (targetTopic && targetTopic.accuracy < 60) {
    recommendationReason = `Recommended because your ${targetTopic.name} accuracy is ${targetTopic.accuracy}%, significantly below your overall accuracy of ${user.stats.accuracy || 75}%.`;
  } else {
    // If no weak topic found or beginner, recommend foundational topics
    const defaultTopic = allTopics.find(t => t.slug === 'arrays' || t.slug === 'strings') || allTopics[0];
    targetTopic = defaultTopic ? { id: defaultTopic._id, name: defaultTopic.name } : null;
    recommendationReason = 'Recommended to build your foundational DSA problem-solving streak in the Arena.';
  }

  // Find unsolved problems from the target topic or general pool
  const query = {
    _id: { $nin: Array.from(solvedProblemIds) },
    status: 'PUBLISHED'
  };

  if (targetTopic && targetTopic.id) {
    query.topics = targetTopic.id;
  }

  let recommendedProblems = await Problem.find(query)
    .populate('topics', 'name slug icon')
    .sort({ difficulty: 1, 'stats.solveCount': -1 })
    .limit(Number(limit));

  // Fallback if target topic is exhausted
  if (recommendedProblems.length < Number(limit)) {
    const fallbackQuery = {
      _id: { $nin: Array.from(solvedProblemIds) },
      status: 'PUBLISHED'
    };
    const additional = await Problem.find(fallbackQuery)
      .populate('topics', 'name slug icon')
      .sort({ 'stats.solveCount': -1 })
      .limit(Number(limit) - recommendedProblems.length);
    
    recommendedProblems = [...recommendedProblems, ...additional];
  }

  return {
    reason: recommendationReason,
    weakTopic: targetTopic ? targetTopic.name : 'Foundational Topics',
    accuracy: targetTopic ? targetTopic.accuracy : 0,
    problems: recommendedProblems
  };
};
