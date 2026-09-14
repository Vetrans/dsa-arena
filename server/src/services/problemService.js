import slugify from 'slugify';
import { Problem, Topic, UserProblem, ProblemTestCase } from '../models/index.js';
import { getCache, setCache } from '../config/redis.js';


export const getProblems = async ({
  page = 1,
  limit = 20,
  difficulty,
  topic,
  status = 'PUBLISHED',
  search,
  sort = 'problemNumber',
  order = 'asc',
  userStatus, // 'SOLVED', 'ATTEMPTED', 'UNSOLVED'
  userId = null
}) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
    query.difficulty = difficulty;
  }

  if (topic) {
    // Topic can be slug or ObjectId
    const foundTopic = await Topic.findOne({
      $or: [{ slug: topic }, { _id: topic.match(/^[0-9a-fA-F]{24}$/) ? topic : null }]
    });
    if (foundTopic) {
      query.topics = foundTopic._id;
    }
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Handle user-specific status filter
  if (userId && userStatus) {
    const userProblems = await UserProblem.find({ userId, status: userStatus }).select('problemId');
    const problemIds = userProblems.map(up => up.problemId);
    if (userStatus === 'UNSOLVED') {
      const solvedOrAttempted = await UserProblem.find({
        userId,
        status: { $in: ['SOLVED', 'ATTEMPTED'] }
      }).select('problemId');
      query._id = { $nin: solvedOrAttempted.map(up => up.problemId) };
    } else {
      query._id = { $in: problemIds };
    }
  }

  const sortOptions = {};
  const sortDirection = order === 'desc' ? -1 : 1;

  if (sort === 'difficulty') {
    sortOptions.difficulty = sortDirection;
  } else if (sort === 'solveCount') {
    sortOptions['stats.solveCount'] = sortDirection;
  } else if (sort === 'rating') {
    sortOptions['rewards.rating'] = sortDirection;
  } else if (sort === 'newest') {
    sortOptions.createdAt = -1;
  } else {
    sortOptions.problemNumber = sortDirection;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Problem.countDocuments(query);
  
  const problems = await Problem.find(query)
    .populate('topics', 'name slug icon')
    .select('-testCases')
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  // If user is logged in, attach solve status
  let userProblemMap = {};
  if (userId) {
    const problemIds = problems.map(p => p._id);
    const userProgress = await UserProblem.find({
      userId,
      problemId: { $in: problemIds }
    });
    userProgress.forEach(up => {
      userProblemMap[up.problemId.toString()] = up.status;
    });
  }

  const formattedProblems = problems.map(problem => {
    const doc = problem.toObject();
    doc.userStatus = userProblemMap[problem._id.toString()] || 'UNSOLVED';
    return doc;
  });

  return {
    problems: formattedProblems,
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / Number(limit))
  };
};

export const getProblemBySlug = async (slug, userId = null) => {
  const cacheKey = `problem:slug:${slug}`;
  let baseDoc = null;

  if (!userId) {
    baseDoc = await getCache(cacheKey);
  }

  if (!baseDoc) {
    const problem = await Problem.findOne({ slug })
      .populate('topics', 'name slug icon description')
      .populate('author', 'username displayName avatar');

    if (!problem) {
      const error = new Error('Problem not found');
      error.statusCode = 404;
      throw error;
    }

    baseDoc = problem.toObject();

    // Strip hidden test cases from public view, only expose sample/public test cases
    if (baseDoc.testCases) {
      baseDoc.sampleTestCases = baseDoc.testCases.filter(tc => !tc.isHidden);
      delete baseDoc.testCases;
    }

    // Cache public problem definition for 1 hour
    await setCache(cacheKey, baseDoc, 3600);
  }

  const doc = { ...baseDoc };

  if (userId) {
    const userProblem = await UserProblem.findOne({ userId, problemId: baseDoc._id });
    doc.userProgress = userProblem ? {
      status: userProblem.status,
      attempts: userProblem.attempts,
      solvedAt: userProblem.solvedAt,
      bestRuntime: userProblem.bestRuntime,
      bestMemory: userProblem.bestMemory,
      hintsUsed: userProblem.hintsUsed
    } : {
      status: 'UNSOLVED',
      attempts: 0,
      hintsUsed: 0
    };
  }

  return doc;
};


export const getProblemHints = async (slug, userId, hintLevel) => {
  const problem = await Problem.findOne({ slug });
  if (!problem) {
    const error = new Error('Problem not found');
    error.statusCode = 404;
    throw error;
  }

  const requestedHint = problem.hints.find(h => h.order === Number(hintLevel));
  if (!requestedHint) {
    const error = new Error(`Hint ${hintLevel} not found`);
    error.statusCode = 404;
    throw error;
  }

  if (userId) {
    await UserProblem.findOneAndUpdate(
      { userId, problemId: problem._id },
      { $max: { hintsUsed: Number(hintLevel) } },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  return {
    order: requestedHint.order,
    content: requestedHint.content,
    totalHints: problem.hints.length
  };
};

export const getProblemEditorial = async (slug, userId = null) => {
  const problem = await Problem.findOne({ slug });
  if (!problem) {
    const error = new Error('Problem not found');
    error.statusCode = 404;
    throw error;
  }

  if (problem.editorial.visibility === 'after_solve' && userId) {
    const userProblem = await UserProblem.findOne({ userId, problemId: problem._id, status: 'SOLVED' });
    if (!userProblem) {
      return {
        isLocked: true,
        message: 'Editorial is unlocked after solving this problem.'
      };
    }
  }

  return {
    isLocked: false,
    editorial: problem.editorial
  };
};

export const createProblem = async (data, authorId) => {
  const lastProblem = await Problem.findOne().sort({ problemNumber: -1 });
  const problemNumber = lastProblem ? lastProblem.problemNumber + 1 : 1;
  const slug = slugify(data.title, { lower: true, strict: true });

  const allTestCases = Array.isArray(data.testCases) ? data.testCases : [];
  const publicTestCases = allTestCases.filter(tc => !tc.isHidden);
  const hiddenTestCases = allTestCases.filter(tc => tc.isHidden);

  const problem = await Problem.create({
    ...data,
    problemNumber,
    slug,
    author: authorId,
    testCases: publicTestCases
  });

  if (hiddenTestCases.length > 0) {
    await ProblemTestCase.findOneAndUpdate(
      { problemId: problem._id },
      { testCases: hiddenTestCases },
      { upsert: true, new: true }
    );
  }

  return problem;
};

export const updateProblem = async (id, data) => {
  if (data.title) {
    data.slug = slugify(data.title, { lower: true, strict: true });
  }

  if (data.testCases) {
    const allTestCases = Array.isArray(data.testCases) ? data.testCases : [];
    const publicTestCases = allTestCases.filter(tc => !tc.isHidden);
    const hiddenTestCases = allTestCases.filter(tc => tc.isHidden);
    data.testCases = publicTestCases;

    if (hiddenTestCases.length > 0) {
      await ProblemTestCase.findOneAndUpdate(
        { problemId: id },
        { testCases: hiddenTestCases },
        { upsert: true, new: true }
      );
    }
  }

  const problem = await Problem.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });

  if (!problem) {
    const error = new Error('Problem not found');
    error.statusCode = 404;
    throw error;
  }

  return problem;
};

export const deleteProblem = async (id) => {
  const problem = await Problem.findByIdAndDelete(id);
  if (!problem) {
    const error = new Error('Problem not found');
    error.statusCode = 404;
    throw error;
  }
  await ProblemTestCase.deleteOne({ problemId: id });
  return problem;
};

