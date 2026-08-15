import mongoose from 'mongoose';

const userProblemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['SOLVED', 'ATTEMPTED', 'UNSOLVED'],
    default: 'UNSOLVED',
    index: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  solvedAt: {
    type: Date,
    default: null
  },
  firstSolveTime: {
    type: Number, // Seconds or ms from first attempt to solve
    default: 0
  },
  bestRuntime: {
    type: Number,
    default: null
  },
  bestMemory: {
    type: Number,
    default: null
  },
  language: {
    type: String,
    default: null
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  rewardGranted: {
    type: Boolean,
    default: false
  },
  xpGranted: {
    type: Number,
    default: 0
  },
  ratingGranted: {
    type: Number,
    default: 0
  },
  lastAttemptAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

userProblemSchema.index({ userId: 1, problemId: 1 }, { unique: true });
userProblemSchema.index({ userId: 1, status: 1 });
userProblemSchema.index({ problemId: 1, status: 1 });

export const UserProblem = mongoose.model('UserProblem', userProblemSchema);
