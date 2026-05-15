import { get, post } from './APICalls';

/**
 * Send notification to users (admin)
 */
export const sendNotification = async (payload) => {
  try {
    const data = await post('/admin/notifications/send', payload);
    return data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

/**
 * Get notification history (admin)
 */
export const getNotificationHistory = async (page = 1) => {
  try {
    const data = await get(`/admin/notifications/history?page=${page}`);
    return data;
  } catch (error) {
    console.error('Error fetching notification history:', error);
    throw error;
  }
};

/**
 * Get list of users for notification selection (admin)
 */
export const getNotificationUsers = async (search = '') => {
  try {
    const data = await get(`/admin/notifications/users${search ? `?search=${search}` : ''}`);
    return data;
  } catch (error) {
    console.error('Error fetching notification users:', error);
    throw error;
  }
};
