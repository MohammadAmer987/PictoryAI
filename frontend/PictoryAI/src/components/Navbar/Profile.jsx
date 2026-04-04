import { useState } from 'react';
import { X,  Mail } from 'lucide-react';
import '../../css/Profile.css';
import EditCredentials from './EditCredentials';
import EditName from './EditName';
export default function Profile({
  isOpen,
  onClose,
  userName = 'Mohammad Nooh',
  userEmail = 'n321632408@stuxtrials.edu',
  storeName = 'My Store',
  onStoreNameChange,
  avatarUrl,
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [userNameState, setCurrentName] = useState(userName);
  const [showStoreModal, setShowStoreModal] = useState(false); 
  const [editStoreName, setEditStoreName] = useState(storeName);
   const handleSaveStoreName = () => {
    if (onStoreNameChange) {
      onStoreNameChange(editStoreName);
    }
    setShowStoreModal(false);
  };

  const handleCancelStoreEdit = () => {
    setEditStoreName(storeName);
    setShowStoreModal(false);
  };

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
            <button className="btn-upload">
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
              <button className="btn-link-green" onClick={()=>setShowEditName(true)}>
                Edit
              </button>
            </div>
              <div className="store-name-section">
              <div className="store-name-label">Store Name</div>
              <div className="store-name-display">
                <span className="store-name-text">{storeName}</span>
                <button
                  className="btn-link-green"
                  onClick={() => setShowStoreModal(true)}
                >
                  Edit
                </button>
              </div>
            </div>      
          </div>
          

          <div className="profile-contact">
            <div className="contact-header">
              <h4 className="contact-title">Contact information</h4>
              <button className="btn-link-green" onClick={() => setShowEditModal(true)}>
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
      <EditCredentials show={showEditModal} onHide={() => setShowEditModal(false)} currentEmail={userEmail} />
        <EditName
        show={showEditName}
        onHide={() => setShowEditName(false)}
        currentName={userNameState}
        onNameUpdate={(newName) => setCurrentName(newName)}
      />
            {showStoreModal && (
        <div className="modal-overlay" onClick={handleCancelStoreEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Store Name</h5>
              <button
                onClick={handleCancelStoreEdit}
                className="btn-close"
                aria-label="Close modal"
              >
                <X className="icon-sm" />
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                value={editStoreName}
                onChange={(e) => setEditStoreName(e.target.value)}
                placeholder="Enter store name"
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleCancelStoreEdit}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                style={{ backgroundColor: 'var(--dark-green)', borderColor: 'var(--dark-green)' }}
                onClick={handleSaveStoreName}
              >
                Save Store Name
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
