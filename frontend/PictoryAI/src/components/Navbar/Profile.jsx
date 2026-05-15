import { useEffect, useState } from "react";
import { X, Mail } from "lucide-react";
import "../../css/Profile.css";
import EditCredentials from "./EditCredentials";
import EditName from "./EditName";
import {
  updateProfileName,
  updateStoreName,
  updateProfileLogo,
} from "../../Services/profileService";

export default function Profile({
  isOpen,
  onClose,
  userName = "Mohammad Nooh",
  userEmail = "n321632408@stu.edu",
  storeName = "My Store",
  onUserUpdated,
  avatarUrl,
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditName, setShowEditName] = useState(false);

  const [showStoreModal, setShowStoreModal] = useState(false);
  const [editStoreName, setEditStoreName] = useState(storeName);
  const [storeError, setStoreError] = useState("");
  const [savingStore, setSavingStore] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  useEffect(() => {
    setEditStoreName(storeName || "");
  }, [storeName]);

  async function handleSaveName(fullName) {
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      throw new Error("Name is required.");
    }

    const response = await updateProfileName(trimmedName);

    if (response?.data?.user && onUserUpdated) {
      onUserUpdated(response.data.user);
    }
  }
  async function handlePhotoUpload(e) {
  const file = e.target.files?.[0];

  if (!file) return;

  setPhotoError("");

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    setPhotoError("Only JPG, PNG, or WEBP images are allowed.");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    setPhotoError("Image size must be less than 2MB.");
    return;
  }

  try {
    setUploadingPhoto(true);

    const response = await updateProfileLogo(file);

    if (response?.data?.user && onUserUpdated) {
      onUserUpdated(response.data.user);
    }
  } catch (err) {
    setPhotoError(err.message || "Failed to upload photo.");
  } finally {
    setUploadingPhoto(false);
    e.target.value = "";
  }
}

  const handleSaveStoreName = async () => {
    setStoreError("");

    const trimmedStoreName = editStoreName.trim();

    if (!trimmedStoreName) {
      setStoreError("Store name is required.");
      return;
    }

    try {
      setSavingStore(true);

      const response = await updateStoreName(trimmedStoreName);

      if (response?.data?.user && onUserUpdated) {
        onUserUpdated(response.data.user);
      }

      setShowStoreModal(false);
    } catch (err) {
      setStoreError(err.message || "Failed to update store name.");
    } finally {
      setSavingStore(false);
    }
  };

  const handleCancelStoreEdit = () => {
    setEditStoreName(storeName || "");
    setStoreError("");
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

      <div className={`profile-sidebar ${isOpen ? "show" : ""}`}>
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
            <label
              className="btn-upload"
              style={{ cursor: uploadingPhoto ? "not-allowed" : "pointer" }}
            >
              {uploadingPhoto ? "Uploading..." : "Upload Photo"}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  style={{ display: "none" }}
                />
              </label>    
                    {photoError && (
        <p style={{ color: "red", fontSize: "13px", marginTop: "8px" }}>
          {photoError}
        </p>
      )}
        </div>

          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  {userName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>

          <div className="profile-info">
            <div className="profile-name-section">
              <h3 className="profile-name">{userName}</h3>

              <button
                className="btn-link-green"
                onClick={() => setShowEditName(true)}
              >
                Edit
              </button>
            </div>

            <div className="store-name-section">
              <div className="store-name-label">Store Name</div>

              <div className="store-name-display">
                <span className="store-name-text">{storeName}</span>

                <button
                  className="btn-link-green"
                  onClick={() => {
                    setEditStoreName(storeName || "");
                    setStoreError("");
                    setShowStoreModal(true);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          <div className="profile-contact">
            <div className="contact-header">
              <h4 className="contact-title">Contact information</h4>

              <button
                className="btn-link-green"
                onClick={() => setShowEditModal(true)}
              >
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
                  {userEmail}
                  <br />
                  ************
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

     <EditCredentials
  show={showEditModal}
  onHide={() => setShowEditModal(false)}
  currentEmail={userEmail}
  onUserUpdated={onUserUpdated}
/>
      <EditName
        show={showEditName}
        onHide={() => setShowEditName(false)}
        currentName={userName}
        onSaveName={handleSaveName}
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
              {storeError && (
                <p style={{ color: "red", marginBottom: "10px" }}>
                  {storeError}
                </p>
              )}

              <input
                type="text"
                className="form-control"
                value={editStoreName}
                onChange={(e) => setEditStoreName(e.target.value)}
                placeholder="Enter store name"
                disabled={savingStore}
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleCancelStoreEdit}
                disabled={savingStore}
              >
                Cancel
              </button>

              <button
                className="btn btn-success"
                style={{
                  backgroundColor: "var(--dark-green)",
                  borderColor: "var(--dark-green)",
                }}
                onClick={handleSaveStoreName}
                disabled={savingStore}
              >
                {savingStore ? "Saving..." : "Save Store Name"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
