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
 * Get notification statistics (admin)
 */
export const getNotificationStats = async () => {
  try {
    const data = await get('/admin/notifications/stats');
    return data;
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    throw error;
  }
};
