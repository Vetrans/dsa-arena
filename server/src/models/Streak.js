import mongoose from 'mongoose';

const streakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: String, // 'YYYY-MM-DD'
    required: true,
    index: true
  },
  problemsSolved: {
    type: Number,
    default: 0
  },
  xpEarned: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

streakSchema.index({ userId: 1, date: -1 }, { unique: true });

export const Streak = mongoose.model('Streak', streakSchema);
