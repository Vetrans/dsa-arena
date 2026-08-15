import { Topic } from '../models/index.js';

export const getAllTopics = async () => {
  return Topic.find().sort({ order: 1, name: 1 });
};

export const getTopicBySlug = async (slug) => {
  const topic = await Topic.findOne({ slug });
  if (!topic) {
    const error = new Error('Topic not found');
    error.statusCode = 404;
    throw error;
  }
  return topic;
};

export const createTopic = async (data) => {
  return Topic.create(data);
};
