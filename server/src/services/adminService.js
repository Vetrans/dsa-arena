import { User, Problem, Submission, Feedback, Comment, Report, AdminAction, FeatureFlag } from '../models/index.js';

export const getAdminDashboardStats = async () => {
  const [
    totalUsers,
    activeUsers,
    totalProblems,
    publishedProblems,
    totalSubmissions,
    acceptedSubmissions,
    totalFeedback,
    totalComments,
    pendingReports
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ status: 'ACTIVE' }),
    Problem.countDocuments(),
    Problem.countDocuments({ status: 'PUBLISHED' }),
    Submission.countDocuments(),
    Submission.countDocuments({ status: 'ACCEPTED' }),
    Feedback.countDocuments(),
    Comment.countDocuments({ status: 'ACTIVE' }),
    Report.countDocuments({ status: 'OPEN' })
  ]);

  const acceptanceRate = totalSubmissions > 0 
    ? Math.round((acceptedSubmissions / totalSubmissions) * 100) 
    : 0;

  // Recent 10 submissions
  const recentSubmissions = await Submission.find()
    .populate('userId', 'username displayName')
    .populate('problemId', 'title difficulty')
    .sort({ createdAt: -1 })
    .limit(10);

  return {
    metrics: {
      totalUsers,
      activeUsers,
      totalProblems,
      publishedProblems,
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate,
      totalFeedback,
      totalComments,
      pendingReports
    },
    recentSubmissions
  };
};

export const getAdminUsers = async ({ page = 1, limit = 20, search, role, status }) => {
  const query = {};
  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { displayName: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-passwordHash')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    users,
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / Number(limit))
  };
};

export const updateUserRole = async (userId, role, adminId) => {
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
  await AdminAction.create({
    adminId,
    action: 'ROLE_CHANGE',
    targetType: 'USER',
    targetId: userId,
    details: { newRole: role }
  });
  return user;
};

export const toggleUserSuspend = async (userId, suspend, reason = '', adminId) => {
  const status = suspend ? 'SUSPENDED' : 'ACTIVE';
  const user = await User.findByIdAndUpdate(userId, {
    status,
    suspendedAt: suspend ? new Date() : null,
    suspendReason: suspend ? reason : null
  }, { new: true });

  await AdminAction.create({
    adminId,
    action: suspend ? 'SUSPEND_USER' : 'UNSUSPEND_USER',
    targetType: 'USER',
    targetId: userId,
    details: { reason }
  });

  return user;
};

export const getAdminFeedback = async ({ page = 1, limit = 20, status, problemId }) => {
  const query = {};
  if (status) query.status = status;
  if (problemId) query.problemId = problemId;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Feedback.countDocuments(query);
  const feedbackList = await Feedback.find(query)
    .populate('problemId', 'title slug difficulty')
    .populate('userId', 'username displayName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    feedbackList,
    total,
    page: Number(page),
    limit: Number(limit)
  };
};

export const updateFeedbackStatus = async (feedbackId, status, adminNotes, adminId) => {
  const feedback = await Feedback.findByIdAndUpdate(feedbackId, {
    status,
    adminNotes
  }, { new: true });
  return feedback;
};
