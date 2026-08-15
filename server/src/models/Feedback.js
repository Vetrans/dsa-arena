import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  difficultyPerception: {
    type: String,
    enum: ['TOO_EASY', 'EASY', 'APPROPRIATE', 'HARD', 'TOO_HARD'],
    required: true
  },
  qualityRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  category: {
    type: String,
    enum: [
      'UNCLEAR_STATEMENT',
      'BAD_CONSTRAINTS',
      'POOR_EXAMPLES',
      'INCORRECT_TEST_CASE',
      'DIFFICULTY_INACCURATE',
      'GOOD_PROBLEM',
      'OTHER'
    ],
    default: 'GOOD_PROBLEM'
  },
  comment: {
    type: String,
    maxlength: 2000,
    default: ''
  },
  status: {
    type: String,
    enum: ['PENDING', 'REVIEWED', 'RESOLVED'],
    default: 'PENDING',
    index: true
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

feedbackSchema.index({ problemId: 1, userId: 1 });

export const Feedback = mongoose.model('Feedback', feedbackSchema);
