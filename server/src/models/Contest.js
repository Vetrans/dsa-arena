import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['UPCOMING', 'LIVE', 'COMPLETED'],
      default: 'UPCOMING',
      index: true
    },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true },
    durationMinutes: { type: Number, default: 90 },
    penaltyMinutes: { type: Number, default: 10 },
    problems: [
      {
        problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
        slug: { type: String, required: true },
        title: { type: String },
        points: { type: Number, default: 250 },
        order: { type: Number, default: 1 }
      }
    ],
    registeredUsers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: { type: String },
        registeredAt: { type: Date, default: Date.now }
      }
    ],
    standings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: { type: String },
        score: { type: Number, default: 0 },
        penalty: { type: Number, default: 0 },
        rank: { type: Number }
      }
    ],
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Contest = mongoose.model('Contest', contestSchema);
