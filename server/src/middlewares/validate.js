import { validationResult } from 'express-validator';
import { error } from '../utils/apiResponse.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => err.msg);
    return error(res, 'Validation Error', 400, 'VALIDATION_ERROR', formattedErrors);
  }
  next();
};
