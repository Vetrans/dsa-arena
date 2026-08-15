import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String, default: '' }
}, { _id: false });

const hintSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  content: { type: String, required: true },
  xpCost: { type: Number, default: 0 }
}, { _id: false });

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expected: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  explanation: { type: String, default: '' }
}, { _id: true });

const editorialApproachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  intuition: { type: String, default: '' },
  algorithm: { type: String, default: '' },
  timeComplexity: { type: String, default: 'O(N)' },
  spaceComplexity: { type: String, default: 'O(1)' },
  code: [{
    language: { type: String, enum: ['cpp', 'python', 'javascript', 'java'] },
    solution: { type: String }
  }]
}, { _id: false });

const problemSchema = new mongoose.Schema({
  problemNumber: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
    index: true
  },
  topics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  examples: [exampleSchema],
  constraints: [{
    type: String
  }],
  inputFormat: {
    type: String,
    default: ''
  },
  outputFormat: {
    type: String,
    default: ''
  },
  hints: [hintSchema],
  editorial: {
    approach: { type: String, default: '' },
    intuition: { type: String, default: '' },
    algorithm: { type: String, default: '' },
    complexity: {
      time: { type: String, default: 'O(N)' },
      space: { type: String, default: 'O(1)' }
    },
    approaches: [editorialApproachSchema],
    commonMistakes: [{ type: String }],
    visibility: {
      type: String,
      enum: ['after_solve', 'always', 'never'],
      default: 'after_solve'
    }
  },
  testCases: [testCaseSchema],
  starterCode: {
    cpp: { type: String, default: '' },
    python: { type: String, default: '' },
    javascript: { type: String, default: '' },
    java: { type: String, default: '' }
  },
  supportedLanguages: [{
    type: String,
    enum: ['cpp', 'python', 'javascript', 'java'],
    default: ['cpp', 'python', 'javascript']
  }],
  timeLimit: {
    type: Number,
    default: 2000 // ms
  },
  memoryLimit: {
    type: Number,
    default: 256 // MB
  },
  rewards: {
    xp: { type: Number, required: true, default: 25 },
    rating: { type: Number, required: true, default: 15 }
  },
  stats: {
    totalSubmissions: { type: Number, default: 0, min: 0 },
    acceptedSubmissions: { type: Number, default: 0, min: 0 },
    solveCount: { type: Number, default: 0, min: 0 },
    successRate: { type: Number, default: 0, min: 0, max: 100 }
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    default: 'PUBLISHED',
    index: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

problemSchema.index({ difficulty: 1, status: 1 });
problemSchema.index({ topics: 1 });
problemSchema.index({ status: 1, createdAt: -1 });
problemSchema.index({ 'stats.solveCount': -1 });

export const Problem = mongoose.model('Problem', problemSchema);
