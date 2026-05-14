import { useState } from 'react';
import { Send, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import '../../css/admincss/Notifications.css';
import { sendNotification, getNotificationStats } from '../../Services/notificationService';

export default function Notifications() {
  const [tab, setTab] = useState('compose'); // compose, history, stats
  const [formData, setFormData] = useState({
    type: 'all',
    user_ids: [],
    title: '',
    message: '',
    link: '',
    send_email: true,
    send_in_app: true,
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [stats, setStats] = useState({
    total_sent: 0,
    total_pending: 0,
    total_failed: 0,
    total_read: 0,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();

    // Validation
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
    if (!formData.send_email && !formData.send_in_app) {
      setError('Select at least one notification channel');
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
        link: '',
        send_email: true,
        send_in_app: true,
      });
      setSelectedUsers([]);
    } catch (err) {
      setError(err.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getNotificationStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch stats');
    }
  };

  return (
    <section className="notificationsPage">
      <div className="notificationsHeader">
        <div>
          <p className="notificationsEyebrow">Communications</p>
          <h2>Send Notifications</h2>
        </div>
      </div>

      {/* Tabs */}
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
        <button
          className={`tab ${tab === 'stats' ? 'tab--active' : ''}`}
          onClick={() => {
            setTab('stats');
            fetchStats();
          }}
        >
          📊 Stats
        </button>
      </div>

      {/* Error/Success Messages */}
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

      {/* Compose Tab */}
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
              <label htmlFor="users">Select Users (coming soon)</label>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                User selection feature will be added soon
              </p>
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

          <div className="formGroup">
            <label htmlFor="link">Action Link (Optional)</label>
            <input
              id="link"
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="formInput"
            />
          </div>

          <div className="formGroup">
            <label>Notification Channels</label>
            <div className="checkboxGroup">
              <label className="checkboxLabel">
                <input
                  type="checkbox"
                  name="send_email"
                  checked={formData.send_email}
                  onChange={handleInputChange}
                />
                <span>📧 Email</span>
              </label>
              <label className="checkboxLabel">
                <input
                  type="checkbox"
                  name="send_in_app"
                  checked={formData.send_in_app}
                  onChange={handleInputChange}
                />
                <span>🔔 In-App Notification</span>
              </label>
            </div>
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
                Send Notification
              </>
            )}
          </button>
        </form>
      )}

      {/* Stats Tab */}
      {tab === 'stats' && (
        <div className="statsGrid">
          <div className="statCard">
            <div className="statIcon" style={{ background: '#dbeafe' }}>
              <CheckCircle size={24} color="#0284c7" />
            </div>
            <div className="statContent">
              <p className="statLabel">Sent</p>
              <strong className="statValue">{stats.total_sent}</strong>
            </div>
          </div>

          <div className="statCard">
            <div className="statIcon" style={{ background: '#fef3c7' }}>
              <Clock size={24} color="#d97706" />
            </div>
            <div className="statContent">
              <p className="statLabel">Pending</p>
              <strong className="statValue">{stats.total_pending}</strong>
            </div>
          </div>

          <div className="statCard">
            <div className="statIcon" style={{ background: '#fee2e2' }}>
              <AlertCircle size={24} color="#dc2626" />
            </div>
            <div className="statContent">
              <p className="statLabel">Failed</p>
              <strong className="statValue">{stats.total_failed}</strong>
            </div>
          </div>

          <div className="statCard">
            <div className="statIcon" style={{ background: '#dbeafe' }}>
              <span style={{ fontSize: '24px' }}>👁️</span>
            </div>
            <div className="statContent">
              <p className="statLabel">Read</p>
              <strong className="statValue">{stats.total_read}</strong>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
