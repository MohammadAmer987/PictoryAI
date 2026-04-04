import { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

const colors = {
  darkGreen: "#043F34",
  midGreen: "#71967D",
  softGreen: "#AFCAB8",
  mintGreen: "#B6E5D2"
};

const EditCredentials = ({ show, onHide, currentEmail }) => {
  const [editMode, setEditMode] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleClose = () => {
    setEditMode(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMessage({ type: '', text: '' });
    onHide();
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'danger', text: 'Please enter a new email address' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      
      setMessage({
        type: 'success',
        text: 'Email update initiated! Please check your new email for confirmation.'
      });
      setTimeout(() => handleClose(), 2000);
    } catch (error) {
      setMessage({ type: 'danger', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!password) {
      setMessage({ type: 'danger', text: 'Please enter a new password' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'danger', text: 'Passwords do not match' });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'danger', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setTimeout(() => handleClose(), 2000);
    } catch (error) {
      setMessage({ type: 'danger', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: colors.softGreen,
          borderBottom: `2px solid ${colors.darkGreen}`
        }}
      >
        <Modal.Title style={{ color: colors.darkGreen, fontWeight: '600' }}>
          Edit Credentials
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: '#f8f9fa' }}>
        {message.text && (
          <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
            {message.text}
          </Alert>
        )}

        {!editMode ? (
          <div className="d-grid gap-3">
            <Button
              variant="outline-success"
              size="lg"
              onClick={() => setEditMode('email')}
              style={{
                borderColor: colors.midGreen,
                color: colors.darkGreen,
                backgroundColor: 'white',
                borderWidth: '2px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.mintGreen;
                e.target.style.borderColor = colors.darkGreen;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = colors.midGreen;
              }}
            >
              Change Email
            </Button>

            <Button
              variant="outline-success"
              size="lg"
              onClick={() => setEditMode('password')}
              style={{
                borderColor: colors.midGreen,
                color: colors.darkGreen,
                backgroundColor: 'white',
                borderWidth: '2px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.mintGreen;
                e.target.style.borderColor = colors.darkGreen;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = colors.midGreen;
              }}
            >
              Change Password
            </Button>
          </div>
        ) : editMode === 'email' ? (
          <Form onSubmit={handleEmailChange}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: colors.darkGreen, fontWeight: '500' }}>
                Current Email
              </Form.Label>
              <Form.Control
                type="email"
                value={currentEmail}
                disabled
                style={{ backgroundColor: '#e9ecef' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: colors.darkGreen, fontWeight: '500' }}>
                New Email Address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter new email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderColor: colors.softGreen }}
              />
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="outline-secondary"
                onClick={() => setEditMode(null)}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: colors.darkGreen,
                  borderColor: colors.darkGreen
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.midGreen;
                  e.target.style.borderColor = colors.midGreen;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.darkGreen;
                  e.target.style.borderColor = colors.darkGreen;
                }}
              >
                {loading ? 'Updating...' : 'Update Email'}
              </Button>
            </div>
          </Form>
        ) : (
          <Form onSubmit={handlePasswordChange}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: colors.darkGreen, fontWeight: '500' }}>
                New Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderColor: colors.softGreen }}
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: colors.darkGreen, fontWeight: '500' }}>
                Confirm New Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ borderColor: colors.softGreen }}
              />
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="outline-secondary"
                onClick={() => setEditMode(null)}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: colors.darkGreen,
                  borderColor: colors.darkGreen
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.midGreen;
                  e.target.style.borderColor = colors.midGreen;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.darkGreen;
                  e.target.style.borderColor = colors.darkGreen;
                }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditCredentials;
