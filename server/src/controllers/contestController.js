import * as contestService from '../services/contestService.js';
import { success, error } from '../utils/apiResponse.js';

export const getContests = async (req, res, next) => {
  try {
    const contests = await contestService.getAllContests(req.query);
    return success(res, contests, 'Contests retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getContest = async (req, res, next) => {
  try {
    const contest = await contestService.getContestBySlug(req.params.slug);
    if (!contest) return error(res, 'Contest not found', 404);
    return success(res, contest, 'Contest details retrieved');
  } catch (err) {
    next(err);
  }
};

export const createContest = async (req, res, next) => {
  try {
    const contest = await contestService.createContest(req.body);
    return success(res, contest, 'Contest created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const registerContest = async (req, res, next) => {
  try {
    const contest = await contestService.registerUserForContest(req.params.slug, req.user);
    return success(res, contest, 'Successfully registered for contest');
  } catch (err) {
    next(err);
  }
};

export const deleteContest = async (req, res, next) => {
  try {
    await contestService.deleteContest(req.params.slug);
    return success(res, null, 'Contest deleted');
  } catch (err) {
    next(err);
  }
};
