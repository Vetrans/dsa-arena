import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['FIRST_STEPS', 'CONSISTENCY', 'MILESTONES', 'COMPETITIVE', 'SKILL', 'COMMUNITY'],
    required: true,
    index: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  condition: {
    type: mongoose.Schema.Types.Mixed,
    required: true
    // e.g. { type: 'problems_solved', threshold: 50, topic: 'Arrays' }
  },
  xpReward: {
    type: Number,
    default: 50
  },
  rarity: {
    type: String,
    enum: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'],
    default: 'COMMON'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const Achievement = mongoose.model('Achievement', achievementSchema);
