import mongoose from 'mongoose';
import argon2 from 'argon2';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  displayName: {
    type: String,
    required: true,
    maxlength: 50
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  role: {
    type: String,
    enum: ['USER', 'STAFF', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'],
    default: 'USER'
  },
  stats: {
    rating: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    rank: { type: String, default: 'Bronze III' },
    problemsSolved: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    globalRank: { type: Number, default: 0 }
  },
  preferences: {
    theme: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
    emailNotifications: { type: Boolean, default: true },
    profilePrivacy: { type: String, enum: ['public', 'private'], default: 'public' }
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'DELETED'],
    default: 'ACTIVE'
  },
  reputation: {
    type: String,
    enum: ['CLEAN', 'WARNED', 'SUSPENDED'],
    default: 'CLEAN'
  },
  warnings: [
    {
      reason: { type: String, required: true },
      issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      issuedAt: { type: Date, default: Date.now }
    }
  ],
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  try {
    this.passwordHash = await argon2.hash(this.passwordHash, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return argon2.verify(this.passwordHash, candidatePassword);
};

userSchema.methods.toPublicProfile = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.preferences;
  return {
    ...obj,
    reputation: obj.reputation || 'CLEAN',
    warnings: obj.warnings || [],
    warningCount: obj.warnings?.length || 0,
    latestWarning: obj.warnings && obj.warnings.length > 0 ? obj.warnings[obj.warnings.length - 1] : null
  };
};

userSchema.index({ 'stats.rating': -1 });
userSchema.index({ 'stats.xp': -1 });
userSchema.index({ 'stats.problemsSolved': -1 });
userSchema.index({ status: 1, 'stats.rating': -1 });
userSchema.index({ status: 1, 'stats.xp': -1 });
userSchema.index({ status: 1, 'stats.problemsSolved': -1 });

export const User = mongoose.model('User', userSchema);
