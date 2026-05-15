import { useState, useEffect } from 'react';
import { Send, X, CheckCircle, AlertCircle, Clock, Mail, Search } from 'lucide-react';
import '../../css/admincss/Notifications.css';
import { sendNotification, getNotificationHistory, getNotificationUsers } from '../../Services/notificationService';

export default function Notifications() {
  const [tab, setTab] = useState('compose');
  const [formData, setFormData] = useState({
    type: 'all',
    user_ids: [],
    title: '',
    message: '',
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 20,
    current_page: 1,
    last_page: 1,
  });
  const [historyLoading, setHistoryLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchUsers = async (search = '') => {
    try {
      setUsersLoading(true);
      const data = await getNotificationUsers(search);
      setAvailableUsers(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === availableUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(availableUsers.map(u => u.id));
    }
  };

  const handleUserSearch = (e) => {
    const value = e.target.value;
    setUserSearch(value);
    if (formData.type === 'specific') {
      fetchUsers(value);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return;
    }
    if (formData.type === 'specific' && selectedUsers.length === 0) {
      setError('Please select at least one user');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const payload = {
        ...formData,
        user_ids: formData.type === 'specific' ? selectedUsers : undefined,
      };

      const response = await sendNotification(payload);

      setSuccess(`${response.message}`);
      setFormData({
        type: 'all',
        user_ids: [],
        title: '',
        message: '',
      });
      setSelectedUsers([]);
      setUserSearch('');
      
      if (tab === 'history') {
        fetchHistory(1);
      }
    } catch (err) {
      setError(err.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (page = 1) => {
    try {
      setHistoryLoading(true);
      const data = await getNotificationHistory(page);
      setNotifications(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setError(err.message || 'Failed to fetch notification history');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'history') {
      fetchHistory(1);
    }
  }, [tab]);

  useEffect(() => {
    if (formData.type === 'specific') {
      fetchUsers(userSearch);
    }
  }, [formData.type]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'sent': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'sent': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'failed': return <AlertCircle size={16} />;
      default: return <Mail size={16} />;
    }
  };

  return (
    <section className="notificationsPage">
      <div className="notificationsHeader">
        <div>
          <p className="notificationsEyebrow">Communications</p>
          <h2>Email Notifications</h2>
        </div>
      </div>

      <div className="notificationsTabs">
        <button
          className={`tab ${tab === 'compose' ? 'tab--active' : ''}`}
          onClick={() => setTab('compose')}
        >
          ✎ Compose
        </button>
        <button
          className={`tab ${tab === 'history' ? 'tab--active' : ''}`}
          onClick={() => setTab('history')}
        >
          📋 History
        </button>
      </div>

      {error && (
        <div className="alertBox alertBox--error">
          <AlertCircle size={20} />
          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
          <button onClick={() => setError(null)} className="alertClose">
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="alertBox alertBox--success">
          <CheckCircle size={20} />
          <div>
            <strong>Success</strong>
            <p>{success}</p>
          </div>
          <button onClick={() => setSuccess(null)} className="alertClose">
            <X size={18} />
          </button>
        </div>
      )}

      {tab === 'compose' && (
        <form onSubmit={handleSendNotification} className="composeForm">
          <div className="formGroup">
            <label htmlFor="type">Send To</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="formInput"
            >
              <option value="all">All Users</option>
              <option value="specific">Specific Users</option>
            </select>
          </div>

          {formData.type === 'specific' && (
            <div className="formGroup">
              <label htmlFor="userSearch">Select Users *</label>
              <div className="userSearchContainer">
                <Search size={18} className="searchIcon" />
                <input
                  id="userSearch"
                  type="text"
                  value={userSearch}
                  onChange={handleUserSearch}
                  placeholder="Search by name or email..."
                  className="formInput userSearchInput"
                />
              </div>
              
              {usersLoading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  <Clock size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                  <p>Loading users...</p>
                </div>
              ) : availableUsers.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                  <Mail size={20} style={{ marginBottom: '8px' }} />
                  <p>No users found</p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      id="selectAll"
                      checked={selectedUsers.length === availableUsers.length && availableUsers.length > 0}
                      onChange={handleSelectAll}
                      style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                    />
                    <label htmlFor="selectAll" style={{ cursor: 'pointer', fontWeight: '500', color: '#1e293b', margin: 0 }}>
                      Select All ({selectedUsers.length}/{availableUsers.length})
                    </label>
                  </div>
                  
                  <div className="usersList">
                    {availableUsers.map((user) => (
                      <label key={user.id} className="userItem">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserToggle(user.id)}
                          style={{ cursor: 'pointer' }}
                        />
                        <div className="userInfo">
                          <div className="userName">{user.name}</div>
                          <div className="userEmail">{user.email}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="formGroup">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., New Feature Released"
              className="formInput"
              maxLength={255}
            />
            <small style={{ color: '#94a3b8' }}>
              {formData.title.length}/255
            </small>
          </div>

          <div className="formGroup">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter your notification message..."
              className="formInput formTextarea"
              rows="6"
            />
            <small style={{ color: '#94a3b8' }}>
              Supports line breaks
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submitButton"
          >
            {loading ? (
              <>
                <Clock size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Sending...
              </>
            ) : (
              <>
                <Send size={18} />
                Send Email Notification
              </>
            )}
          </button>
        </form>
      )}

      {tab === 'history' && (
        <div className="historyContainer">
          {historyLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <Clock size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} />
              <p>Loading notification history...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <Mail size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
              <p>No notifications sent yet</p>
            </div>
          ) : (
            <>
              <div className="historyTable">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Recipient</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Sent At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((notification) => (
                      <tr key={notification.id}>
                        <td>
                          <strong>{notification.title}</strong>
                        </td>
                        <td>
                          <div style={{ fontSize: '13px' }}>
                            {notification.user?.email || 'N/A'}
                          </div>
                        </td>
                        <td>
                          <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '300px' }}>
                            {notification.message.substring(0, 60)}
                            {notification.message.length > 60 ? '...' : ''}
                          </p>
                        </td>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              color: getStatusColor(notification.status),
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            {getStatusIcon(notification.status)}
                            <span style={{ textTransform: 'capitalize' }}>
                              {notification.status}
                            </span>
                          </div>
                        </td>
                        <td>
                          <small style={{ color: '#94a3b8' }}>
                            {notification.sent_at
                              ? new Date(notification.sent_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '-'}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.last_page > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                  <button
                    onClick={() => fetchHistory(Math.max(1, pagination.current_page - 1))}
                    disabled={pagination.current_page === 1}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: pagination.current_page === 1 ? 'not-allowed' : 'pointer',
                      opacity: pagination.current_page === 1 ? 0.5 : 1,
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ padding: '8px 12px', color: '#64748b' }}>
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                  <button
                    onClick={() => fetchHistory(Math.min(pagination.last_page, pagination.current_page + 1))}
                    disabled={pagination.current_page === pagination.last_page}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: pagination.current_page === pagination.last_page ? 'not-allowed' : 'pointer',
                      opacity: pagination.current_page === pagination.last_page ? 0.5 : 1,
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
