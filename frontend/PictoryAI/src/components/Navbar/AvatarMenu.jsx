import { useState } from "react";
import Profile from "./Profile";
import { Bell } from "lucide-react";
import React, { useRef, useEffect } from "react";

export default function AvatarMenu({
  user,
  openMenu,
  toggle,
  handleNavigate,
  onLogout,
  onUserUpdated,
  notifications = [],
  unreadCount = 0,
  onClearNotifications = () => {},
}) {
  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    if (bellOpen) {
      onClearNotifications();
    }

    setBellOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await onLogout();
  };

  return (
    <div className="nav-right">
      {user && (
        <div className="nav-bell" ref={bellRef}>
          <button className="bell-btn" onClick={handleBellClick}>
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="bell-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="bell-dropdown">
              <div className="bell-dropdown-header">Notifications</div>

              {notifications.length === 0 ? (
                <div className="bell-empty">
                  <Bell size={28} />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <ul className="bell-list">
                  {notifications.map((n) => (
                    <li key={n.id} className="bell-item">
                      <div className="bell-item-text">
                        <p className="bell-item-msg">{n.message}</p>

                        {n.sub && <p className="bell-item-sub">{n.sub}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {user ? (
        <>
          <div
            className={`nav-avatar active ${
              openMenu === "avatar" ? "open" : ""
            }`}
            onClick={() => toggle("avatar")}
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || "User"}
                className="nav-avatar-image"
              />
            ) : (
              initials
            )}

            <div className="avatar-dropdown">
              <div className="avatar-header">
                <div className="avatar-name">{user.name}</div>

                <div className="avatar-email">
                  {user.email} <br /> {user.plan} Plan
                </div>
              </div>

              <div
                className="avatar-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileOpen(true);
                }}
              >
                My Account
              </div>

              <div
                className="avatar-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate("/history");
                }}
              >
                Content History
              </div>

              <div
                className="avatar-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate("/subscription");
                }}
              >
                Manage Subscription
              </div>

              <div className="dd-divider" />

              <div
                className="avatar-item danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
              >
                Sign Out
              </div>
            </div>
          </div>

          <Profile
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            userName={user.name}
            userEmail={user.email}
            storeName={user.store_name}
            onUserUpdated={onUserUpdated}
            avatarUrl={user?.avatarUrl}
          />
        </>
      ) : (
        <button className="btn-login" onClick={() => handleNavigate("/login")}>
          Log In
        </button>
      )}
    </div>
  );
}