import '../../css/Dashboard.css';

import StatCard from './StatCard';
import UsersTable from './UsersTable';
import Analytics from './Analytics';

import { users } from './mockData';

export default function Dashboard({ searchQuery = '' }) {
  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status?.toLowerCase() === 'active'
  ).length;

  const premiumUsers = users.filter(
    (user) => user.plan?.toLowerCase() !== 'free'
  ).length;

  const totalImagesLeft = users.reduce((total, user) => {
    return total + Number(user.imagesRemaining || 0);
  }, 0);

  const latestUsers = users.slice(0, 5);

  return (
    <div className="dashboardPage">
      <section className="dashboardStats">
        <StatCard
          label="Total Users"
          value={totalUsers}
          sub="Registered platform users"
          trend="up"
        />

        <StatCard
          label="Active Users"
          value={activeUsers}
          sub="Currently active accounts"
          trend="up"
        />

        <StatCard
          label="Premium Users"
          value={premiumUsers}
          sub="Users with paid plans"
          trend="up"
        />

        <StatCard
          label="Images Left"
          value={totalImagesLeft}
          sub="Remaining user image credits"
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