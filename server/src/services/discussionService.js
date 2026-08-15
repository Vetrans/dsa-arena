import { Comment, Problem, Notification } from '../models/index.js';

export const getProblemDiscussions = async (problemId, { page = 1, limit = 20, sort = 'top' }) => {
  const skip = (Number(page) - 1) * Number(limit);
  const sortOption = sort === 'newest' ? { createdAt: -1 } : { upvotes: -1, createdAt: -1 };

  // Fetch top-level comments
  const query = { problemId, parentId: null, status: { $ne: 'DELETED' } };
  const total = await Comment.countDocuments(query);

  const comments = await Comment.find(query)
    .populate('userId', 'username displayName avatar stats.rank')
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  // Populate replies for these top-level comments
  const commentIds = comments.map(c => c._id);
  const replies = await Comment.find({
    parentId: { $in: commentIds },
    status: { $ne: 'DELETED' }
  })
    .populate('userId', 'username displayName avatar stats.rank')
    .sort({ createdAt: 1 });

  const replyMap = {};
  replies.forEach(r => {
    const pId = r.parentId.toString();
    if (!replyMap[pId]) replyMap[pId] = [];
    replyMap[pId].push(r);
  });

  const formatted = comments.map(c => {
    const doc = c.toObject();
    doc.replies = replyMap[c._id.toString()] || [];
    return doc;
  });

  return {
    comments: formatted,
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / Number(limit))
  };
};

export const createComment = async ({ problemId, userId, parentId = null, content, isSpoiler = false }) => {
  const comment = await Comment.create({
    problemId,
    userId,
    parentId,
    content,
    isSpoiler
  });

  if (parentId) {
    const parent = await Comment.findByIdAndUpdate(parentId, { $inc: { replyCount: 1 } });
    if (parent && parent.userId.toString() !== userId.toString()) {
      await Notification.create({
        userId: parent.userId,
        type: 'DISCUSSION_REPLY',
        title: '💬 New Reply',
        message: 'Someone replied to your comment in the Arena discussions.',
        link: `/problems/${problemId}#discussion`
      });
    }
  }

  return comment.populate('userId', 'username displayName avatar stats.rank');
};

export const voteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    const error = new Error('Comment not found');
    error.statusCode = 404;
    throw error;
  }

  const hasUpvoted = comment.upvotedBy.some(id => id.toString() === userId.toString());
  if (hasUpvoted) {
    comment.upvotedBy = comment.upvotedBy.filter(id => id.toString() !== userId.toString());
    comment.upvotes = Math.max(0, comment.upvotes - 1);
  } else {
    comment.upvotedBy.push(userId);
    comment.upvotes += 1;

    if (comment.userId.toString() !== userId.toString()) {
      await Notification.create({
        userId: comment.userId,
        type: 'UPVOTE',
        title: '👍 Upvote Received',
        message: 'Your discussion post was upvoted by an Arena member.',
        link: `/problems/${comment.problemId}#discussion`
      });
    }
  }

  await comment.save();
  return { upvotes: comment.upvotes, hasUpvoted: !hasUpvoted };
};

export const deleteComment = async (commentId, userId, userRole) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    const error = new Error('Comment not found');
    error.statusCode = 404;
    throw error;
  }

  if (comment.userId.toString() !== userId.toString() && userRole !== 'ADMIN') {
    const error = new Error('Not authorized to delete this comment');
    error.statusCode = 403;
    throw error;
  }

  comment.status = 'DELETED';
  comment.content = '[This comment was deleted]';
  await comment.save();
  return { message: 'Comment deleted successfully' };
};
