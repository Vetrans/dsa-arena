import { Notification } from '../models/index.js';

export const getUserNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false }) => {
  const query = { userId };
  if (unreadOnly) {
    query.isRead = false;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ userId, isRead: false });

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    notifications,
    unreadCount,
    total,
    page: Number(page),
    limit: Number(limit)
  };
};

export const markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  return { success: true };
};

export const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({ userId, isRead: false });
  return { unreadCount: count };
};
