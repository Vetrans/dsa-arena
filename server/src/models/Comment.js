import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
    index: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  isSpoiler: {
    type: Boolean,
    default: false
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replyCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'DELETED', 'HIDDEN'],
    default: 'ACTIVE',
    index: true
  }
}, { timestamps: true });

commentSchema.index({ problemId: 1, parentId: 1, createdAt: -1 });

export const Comment = mongoose.model('Comment', commentSchema);
