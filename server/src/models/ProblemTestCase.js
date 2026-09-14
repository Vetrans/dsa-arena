import mongoose from 'mongoose';

const testCaseItemSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expected: { type: String, required: true },
  isHidden: { type: Boolean, default: true },
  explanation: { type: String, default: '' }
}, { _id: true });

const problemTestCaseSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    unique: true,
    index: true
  },
  testCases: [testCaseItemSchema]
}, { timestamps: true });

export const ProblemTestCase = mongoose.model('ProblemTestCase', problemTestCaseSchema);
