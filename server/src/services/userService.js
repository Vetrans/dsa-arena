import { User } from '../models/index.js';

export const getUserByUsername = async (username) => {
  const user = await User.findOne({ username });
  if (!user || user.status !== 'ACTIVE') {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user.toPublicProfile();
};

export const updateProfile = async (userId, updates) => {
  const allowedUpdates = ['displayName', 'avatar', 'bio', 'preferences'];
  const updateData = {};
  
  for (const key of Object.keys(updates)) {
    if (allowedUpdates.includes(key)) {
      updateData[key] = updates[key];
    }
  }

  const user = await User.findByIdAndUpdate(userId, updateData, { 
    new: true, 
    runValidators: true 
  });
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user.toPublicProfile();
};

export const searchUsers = async (query, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const searchRegex = new RegExp(query, 'i');
  
  const filter = {
    status: 'ACTIVE',
    $or: [
      { username: searchRegex },
      { displayName: searchRegex }
    ]
  };

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ 'stats.rating': -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter)
  ]);

  return {
    users: users.map(u => u.toPublicProfile()),
    total,
    page,
    limit
  };
};
