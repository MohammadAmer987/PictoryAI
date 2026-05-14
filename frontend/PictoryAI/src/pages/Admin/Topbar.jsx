import { useState } from 'react';
import '../../css/admincss/Topbar.css';
import Icon from './Icon';

const pageTitles = {
  dashboard: 'Dashboard',
  users: 'User Management',
  analytics: 'Analytics',
  activity: 'Activity Log',
};

export default function Topbar({ activePage, onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch && onSearch(e.target.value);
  };

  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="topbar">
      <div className="right">
        <div className="pageInfo">
          <h1 className="pageTitle">{pageTitles[activePage] || 'Dashboard'}</h1>
          <p className="pageDate">{now}</p>
        </div>
      </div>

      <div className="left">
        <div className="searchWrap">
          <Icon name="search" size={14} className="searchIcon" />
          <input
            type="text"
            className="searchInput"
            placeholder="Search..."
            value={query}
            onChange={handleSearch}
          />
        </div>

        <button className="iconBtn">
          <Icon name="bell" size={16} />
          <span className="notifDot" />
        </button>
      </div>
    </header>
  );
}
