import { useEffect, useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

const colors = {
  darkGreen: "#043F34",
  midGreen: "#71967D",
  softGreen: "#AFCAB8",
  mintGreen: "#B6E5D2",
};

const EditName = ({ show, onHide, currentName, onSaveName }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!show) return;

    const parts = (currentName || "").trim().split(" ").filter(Boolean);

    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
    setMessage({ type: "", text: "" });
  }, [show, currentName]);

  const handleClose = () => {
    setFirstName("");
    setLastName("");
    setMessage({ type: "", text: "" });
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName) {
      setMessage({ type: "danger", text: "Please enter a name." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await onSaveName(fullName);

      setMessage({
        type: "success",
        text: "Name updated successfully!",
      });

      setTimeout(() => {
        handleClose();
      }, 800);
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.message || "Failed to update name.",
      });
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
          borderBottom: `2px solid ${colors.darkGreen}`,
        }}
      >
        <Modal.Title style={{ color: colors.darkGreen, fontWeight: "600" }}>
          Edit Name
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#f8f9fa" }}>
        {message.text && (
          <Alert
            variant={message.type}
            onClose={() => setMessage({ type: "", text: "" })}
            dismissible
          >
            {message.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: colors.darkGreen, fontWeight: "500" }}>
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
            <Form.Label style={{ color: colors.darkGreen, fontWeight: "500" }}>
              Last Name
            </Form.Label>

            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
                borderColor: colors.darkGreen,
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
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditName;