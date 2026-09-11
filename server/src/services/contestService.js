import { Contest } from '../models/index.js';

export const getAllContests = async (query = {}) => {
  const filter = { isPublished: true };
  if (query.status) filter.status = query.status.toUpperCase();
  return Contest.find(filter).sort({ startTime: -1 }).lean();
};

export const getContestBySlug = async (slug) => {
  return Contest.findOne({ slug }).lean();
};

export const createContest = async (data) => {
  const duration = Number(data.durationMinutes || 90);
  const start = new Date(data.startTime || Date.now());
  const end = new Date(start.getTime() + duration * 60000);

  const contest = new Contest({
    title: data.title,
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: data.description || '',
    status: data.status || (start > new Date() ? 'UPCOMING' : 'LIVE'),
    startTime: start,
    endTime: end,
    durationMinutes: duration,
    penaltyMinutes: Number(data.penaltyMinutes || 10),
    problems: data.problems || [],
    isPublished: data.isPublished !== undefined ? data.isPublished : true
  });

  return contest.save();
};

export const registerUserForContest = async (slug, user) => {
  const contest = await Contest.findOne({ slug });
  if (!contest) throw new Error('Contest not found');

  const alreadyRegistered = contest.registeredUsers.some(
    (u) => u.userId.toString() === user._id.toString()
  );

  if (!alreadyRegistered) {
    contest.registeredUsers.push({
      userId: user._id,
      username: user.username,
      registeredAt: new Date()
    });
    await contest.save();
  }

  return contest;
};

export const deleteContest = async (slug) => {
  return Contest.findOneAndDelete({ slug });
};
