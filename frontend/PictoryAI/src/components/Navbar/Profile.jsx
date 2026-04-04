import { useState } from 'react';
import { X, Clock, ChevronDown, MoreVertical, Mail } from 'lucide-react';
import '../../css/Profile.css';

export default function Profile({
  isOpen,
  onClose,
  userName = 'Mohammad Nooh',
  userEmail = 'n321632408@stuxtrials.edu',
  userStatus = 'Away',
  userTime = '3:32 PM local time',
  avatarUrl,
}) {
  const [, setIsHovered] = useState(false);

  return (
    <>
      {isOpen && (

        <div
          className="profile-overlay"
          onClick={onClose}
          role="presentation"
        />
       
      )}

      <div className={`profile-sidebar ${isOpen ? 'show' : ''}`}>
        <div className="profile-header">
          <h2 className="profile-title">Profile</h2>
          <button
            onClick={onClose}
            className="btn-close"
            aria-label="Close sidebar"
          >
            <X className="icon-sm" />
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-banner">
            <button className="btn btn-light btn-upload">
              Upload Photo
            </button>
          </div>

          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="profile-info">
            <div className="profile-name-section">
              <h3 className="profile-name">{userName}</h3>
              <button className="btn-link-green">
                Edit
              </button>
            </div>

            <button className="btn-link-green-sm">
              + Add name pronunciation
            </button>

            <div className="status-badge">
              <span className="status-dot"></span>
              <span className="status-text">{userStatus}</span>
            </div>

            <div className="time-info">
              <Clock className="icon-xs" />
              <span className="time-text">{userTime}</span>
            </div>

            <div className="profile-actions">
              <button className="btn btn-outline-secondary btn-action">
                Set a status
              </button>
              <div className="action-group">
                <button
                  className="btn btn-outline-secondary btn-action"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  View as
                  <ChevronDown className="icon-xs ms-2" />
                </button>
                <button className="btn btn-outline-secondary btn-icon">
                  <MoreVertical className="icon-xs" />
                </button>
              </div>
            </div>
          </div>

          <div className="profile-contact">
            <div className="contact-header">
              <h4 className="contact-title">Contact information</h4>
              <button className="btn-link-green">
                Edit
              </button>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Mail className="icon-sm" />
              </div>
              <div className="contact-details">
                <p className="contact-label">Email Address</p>
                <p className="contact-value">
                  {userEmail}<br />
                  ************
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
