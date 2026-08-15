import express from 'express';
import * as topicService from '../services/topicService.js';
import { success } from '../utils/apiResponse.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const topics = await topicService.getAllTopics();
    return success(res, topics);
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const topic = await topicService.getTopicBySlug(req.params.slug);
    return success(res, topic);
  } catch (error) {
    next(error);
  }
});

export default router;
