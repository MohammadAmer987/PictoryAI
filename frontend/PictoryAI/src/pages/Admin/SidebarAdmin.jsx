import '../../css/admincss/SidebarAdmin.css';
import Icon from './Icon';
import { navItems } from './mockData';

export default function SidebarAdmin({
  activePage,
  onNavigate,
  onLogout,
  isOpen = true,
  onToggle,
}) {
  const handleLogoutClick = async () => {
    try {
      await onLogout?.();
    } catch {
      // Continue to login even if the logout API is unavailable.
    } finally {
      window.location.href = '/login';
    }
  };

  return (
    <aside className={`adminSidebar ${isOpen ? 'adminSidebar--open' : 'adminSidebar--closed'}`}>
      <button
        type="button"
        className="adminSidebar__toggle"
        onClick={onToggle}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? '‹' : '›'}
      </button>

      <div className="adminSidebar__logo">
        <div className="adminSidebar__logoIcon">P</div>

        {isOpen && (
          <div>
            <p className="adminSidebar__logoName">Pictory AI</p>
            <p className="adminSidebar__logoSub">Admin Panel</p>
          </div>
        )}
      </div>

      <nav className="adminSidebar__nav">
        {isOpen && <p className="adminSidebar__navGroup">Main Menu</p>}

        {navItems.map((item) => (
          <button
            key={item.id}
            className={`adminSidebar__navItem ${
              activePage === item.id ? 'adminSidebar__navItem--active' : ''
            }`}
            onClick={() => onNavigate?.(item.id)}
            title={!isOpen ? item.label : undefined}
          >
            <Icon name={item.icon} size={18} />

            {isOpen && <span>{item.label}</span>}

            {isOpen && activePage === item.id && (
              <div className="adminSidebar__activeDot" />
            )}
          </button>
        ))}
      </nav>

      <div className="adminSidebar__bottom">
        <div className="adminSidebar__adminCard">
          <div className="adminSidebar__avatar">A</div>

          {isOpen && (
            <div className="adminSidebar__adminInfo">
              <p className="adminSidebar__adminName">Admin</p>
              <p className="adminSidebar__adminRole">Super Admin</p>
            </div>
          )}
        </div>

        <button className="adminSidebar__logout" onClick={handleLogoutClick}>
          <Icon name="logout" size={16} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}