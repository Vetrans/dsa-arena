import mongoose from 'mongoose';

const leaderboardEntrySchema = new mongoose.Schema({
  rank: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  displayName: { type: String },
  avatar: { type: String },
  rating: { type: Number },
  xp: { type: Number },
  problemsSolved: { type: Number },
  currentStreak: { type: Number },
  rankTier: { type: String },
  change: { type: Number, default: 0 }
}, { _id: false });

const leaderboardSnapshotSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['OVERALL', 'WEEKLY', 'MONTHLY'],
    required: true
  },
  metric: {
    type: String,
    enum: ['rating', 'xp', 'problems_solved', 'streak', 'accuracy'],
    required: true
  },
  period: {
    type: String, // e.g. 'ALL_TIME', '2026-W33', '2026-08'
    required: true
  },
  rankings: [leaderboardEntrySchema],
  totalRanked: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

leaderboardSnapshotSchema.index({ type: 1, metric: 1, period: 1 }, { unique: true });

export const LeaderboardSnapshot = mongoose.model('LeaderboardSnapshot', leaderboardSnapshotSchema);
