import mongoose from 'mongoose';

const xpTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  newTotal: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: null
  },
  sourceType: {
    type: String,
    enum: ['problem', 'daily_challenge', 'streak_bonus', 'achievement', 'first_solve', 'admin_adjustment'],
    default: 'problem',
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: { createdAt: true, updatedAt: false } });

xpTransactionSchema.index({ userId: 1, createdAt: -1 });

export const XPTransaction = mongoose.model('XPTransaction', xpTransactionSchema);
