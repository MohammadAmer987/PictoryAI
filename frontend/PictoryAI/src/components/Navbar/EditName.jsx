import { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

const colors = {
  darkGreen: "#043F34",
  midGreen: "#71967D",
  softGreen: "#AFCAB8",
  mintGreen: "#B6E5D2"
};

const EditName = ({ show, onHide, currentName, onNameUpdate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleOpen = () => {
    if (currentName) {
      const [first, last] = currentName.split(' ');
      setFirstName(first || '');
      setLastName(last || '');
    }
    setMessage({ type: '', text: '' });
  };

  const handleClose = () => {
    setFirstName('');
    setLastName('');
    setMessage({ type: '', text: '' });
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      setMessage({ type: 'danger', text: 'Please enter both first and last name' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const fullName = `${firstName} ${lastName}`;

      
      setMessage({ type: 'success', text: 'Name updated successfully!' });

      if (onNameUpdate) {
        onNameUpdate(fullName);
      }

      setTimeout(() => handleClose(), 2000);
    } catch (error) {
      setMessage({ type: 'danger', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered onEnter={handleOpen}>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: colors.softGreen,
          borderBottom: `2px solid ${colors.darkGreen}`
        }}
      >
        <Modal.Title style={{ color: colors.darkGreen, fontWeight: '600' }}>
          Edit Name
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: '#f8f9fa' }}>
        {message.text && (
          <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
            {message.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: colors.darkGreen, fontWeight: '500' }}>
              First Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={{ borderColor: colors.softGreen }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: colors.darkGreen, fontWeight: '500' }}>
              Last Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={{ borderColor: colors.softGreen }}
            />
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="outline-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
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
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditName;
