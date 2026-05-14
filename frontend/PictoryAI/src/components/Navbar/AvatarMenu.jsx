import { useState } from 'react';
import Profile from './Profile';

export default function AvatarMenu({ user, openMenu, toggle, handleNavigate, onLogout,  onUserUpdated
}) {

    const initials = user
        ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : ""
        
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const handleLogout = async () => {
  await onLogout();
};
    
    return (
        <div className="nav-right">

            {user ? (

                <div
                    className={`nav-avatar active ${openMenu === 'avatar' ? 'open' : ''}`}
                    onClick={() => toggle('avatar')}
                >

                    {initials}

                    <div className="avatar-dropdown">

                        <div className="avatar-header">
                            <div className="avatar-name">{user.name}</div>
                            <div className="avatar-email">
                                {user.email} <br /> {user.plan} Plan
                            </div>
                        </div>

                        <div className="avatar-item" onClick={() => setIsProfileOpen(true)}>
                            My Account
                        </div>

                        <div className="avatar-item" onClick={() => handleNavigate('/history')}>
                            Content History
                        </div>

                        <div className="avatar-item" onClick={() => handleNavigate('/subscription')}>
                            Manage Subscription
                        </div>

                        <div className="dd-divider" />

                        <div className="avatar-item danger" onClick={handleLogout}>
                            Sign Out
                        </div>

                    </div>
                    <Profile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName={user.name}
        userEmail={user.email}
        storeName={user.store_name}
          onUserUpdated={onUserUpdated}

      />

                </div>

            ) : (

                <button className="btn-login" onClick={() => handleNavigate('/login')}>
                              Log In                </button>

            )}

        </div>
    )
}