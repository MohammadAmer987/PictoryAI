import { useState } from 'react';

import SidebarAdmin from './SidebarAdmin';
import Topbar from './Topbar';
import Dashboard from './Dashboard';
import Users from './Users';
import Analytics from './Analytics';
import Revenue from './Revenue';

import '../../css/AdminPanel.css';

export default function AdminPanel({ onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`adminPanel ${sidebarOpen ? 'sidebarOpened' : 'sidebarClosed'}`}>
      <SidebarAdmin
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="adminContent">
        <Topbar
          activePage={activePage}
          onSearch={setSearchQuery}
        />

        <main className="adminMain">
          {activePage === 'dashboard' && (
            <Dashboard searchQuery={searchQuery} />
          )}

          {activePage === 'users' && (
            <Users searchQuery={searchQuery} />
          )}

          {activePage === 'analytics' && (
            <Analytics />
          )}

          {activePage === 'revenue' && (
            <Revenue />
          )}
        </main>
      </div>
    </div>
  );
}