import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  icon: {
    type: String,
    default: '📝'
  },
  description: {
    type: String,
    default: ''
  },
  problemCount: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

topicSchema.index({ slug: 1 }, { unique: true });
topicSchema.index({ name: 1 }, { unique: true });

export const Topic = mongoose.model('Topic', topicSchema);
