import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  testCaseIndex: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  input: { type: String },
  expectedOutput: { type: String },
  actualOutput: { type: String },
  error: { type: String, default: null },
  runtime: { type: Number, default: 0 }, // ms
  memory: { type: Number, default: 0 }  // KB
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    index: true
  },
  language: {
    type: String,
    enum: ['cpp', 'python', 'javascript', 'java', 'c', 'go', 'rust'],
    required: true
  },
  code: {
    type: String,
    required: true,
    maxlength: 65536
  },
  status: {
    type: String,
    enum: [
      'QUEUED',
      'RUNNING',
      'ACCEPTED',
      'WRONG_ANSWER',
      'TIME_LIMIT_EXCEEDED',
      'MEMORY_LIMIT_EXCEEDED',
      'RUNTIME_ERROR',
      'COMPILATION_ERROR',
      'SYSTEM_ERROR'
    ],
    default: 'QUEUED',
    index: true
  },
  runtime: {
    type: Number, // ms
    default: 0
  },
  memory: {
    type: Number, // KB
    default: 0
  },
  passedTestCases: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  },
  testResults: [testResultSchema],
  errorMessage: {
    type: String,
    default: null
  },
  compileOutput: {
    type: String,
    default: null
  },
  isFirstAccepted: {
    type: Boolean,
    default: false
  },
  xpAwarded: {
    type: Number,
    default: 0
  },
  ratingAwarded: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

submissionSchema.index({ userId: 1, problemId: 1, createdAt: -1 });
submissionSchema.index({ userId: 1, status: 1 });
submissionSchema.index({ problemId: 1, status: 1 });
submissionSchema.index({ createdAt: -1 });

export const Submission = mongoose.model('Submission', submissionSchema);
