import mongoose from 'mongoose';

const adminActionSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    enum: ['USER', 'PROBLEM', 'COMMENT', 'FEEDBACK', 'REPORT', 'SYSTEM'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: { createdAt: true, updatedAt: false } });

adminActionSchema.index({ createdAt: -1 });

export const AdminAction = mongoose.model('AdminAction', adminActionSchema);
