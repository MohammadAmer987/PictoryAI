import { get } from './APICalls';

/**
 * Get all users with their data
 */
export const getAllUsers = async () => {
  try {
    const data = await get('/admin/users');
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const data = await get('/admin/dashboard/stats');
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Get analytics data
 */
export const getAnalytics = async () => {
  try {
    const data = await get('/admin/analytics');
    return data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

/**
 * Get revenue analytics
 */
export const getRevenueAnalytics = async () => {
  try {
    const data = await get('/admin/revenue');
    return data;
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    throw error;
  }
};
