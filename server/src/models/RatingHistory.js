import mongoose from 'mongoose';

const ratingHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  change: {
    type: Number,
    required: true
  },
  newRating: {
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
    enum: ['problem', 'daily_challenge', 'contest', 'admin_adjustment'],
    default: 'problem',
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: { createdAt: true, updatedAt: false } });

ratingHistorySchema.index({ userId: 1, createdAt: -1 });

export const RatingHistory = mongoose.model('RatingHistory', ratingHistorySchema);
