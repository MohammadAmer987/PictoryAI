import { useState, useEffect } from 'react';
import '../../css/Dashboard.css';

import StatCard from './StatCard';
import UsersTable from './UsersTable';
import Analytics from './Analytics';

import { getDashboardStats, getAllUsers } from '../../Services/adminService';

export default function Dashboard({ searchQuery = '' }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, usersData] = await Promise.all([
        getDashboardStats(),
        getAllUsers(),
      ]);

      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const latestUsers = users.slice(0, 5);

  if (loading) {
    return (
      <div className="dashboardPage">
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboardPage">
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboardPage">
      <section className="dashboardStats">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          sub="Registered platform users"
          trend="up"
        />

        <StatCard
          label="Active Users"
          value={stats.activeUsers}
          sub="Currently active accounts"
          trend="up"
        />

        <StatCard
          label="Premium Users"
          value={stats.premiumUsers}
          sub="Users with paid plans"
          trend="up"
        />

      </section>

      <section className="dashboardSection">
        <div className="sectionHeader">
          <div>
            <p className="sectionEyebrow">Overview</p>
            <h2>Latest Users</h2>
          </div>
        </div>

        <UsersTable users={latestUsers} searchQuery={searchQuery} />
      </section>

      <section className="dashboardSection">
        <Analytics />
      </section>
    </div>
  );
}