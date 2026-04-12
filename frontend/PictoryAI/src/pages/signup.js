import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #afcab8",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box",
};

const businessTypes = [
  "restaurant",
  "cafe",
  "bakery",
  "clothing",
  "beauty",
  "electronics",
  "perfume",
  "jewelry",
  "home_decor",
  "fitness",
  "pharmacy",
  "supermarket",
  "bookstore",
  "toy_store",
  "services",
  "other",
];

function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    owner_name: "",
    store_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    business_type: "",
    business_description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (
      !formData.owner_name ||
      !formData.store_name ||
      !formData.email ||
      !formData.password ||
      !formData.password_confirmation ||
      !formData.business_type
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Password confirmation does not match.");
      return;
    }

    try {
      setLoading(true);

    await register(formData);

    setSuccess("Account created successfully.");

    setFormData({
      owner_name: "",
      store_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      business_type: "",
      business_description: "",
    });

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  } catch (err) {
    setError(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7fbf8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        zIndex: "1",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "35px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          border: "1px solid #afcab8",
          position: "relative",
        }}
      >
        <h1 style={{ color: "#045f34", marginBottom: "10px" }}>Sign Up</h1>
        <p style={{ color: "#666", marginBottom: "25px" }}>
          Create your account to start using Pictory AI.
        </p>

        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>
        )}

        {success && (
          <p style={{ color: "green", marginBottom: "15px" }}>{success}</p>
        )}

        <div style={{ display: "grid", gap: "15px" }}>
          <input
            type="text"
            name="owner_name"
            placeholder="Owner Name"
            style={inputStyle}
            value={formData.owner_name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="store_name"
            placeholder="Store Name"
            style={inputStyle}
            value={formData.store_name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            style={inputStyle}
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            style={inputStyle}
            value={formData.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            style={inputStyle}
            value={formData.password_confirmation}
            onChange={handleChange}
          />

          <select
            name="business_type"
            style={inputStyle}
            value={formData.business_type}
            onChange={handleChange}
          >
            <option value="">Select Business Type</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <textarea
            name="business_description"
            placeholder="Business Description"
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
            value={formData.business_description}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            backgroundColor: "#045f34",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "12px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
            color: "#71967d",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </p>
      </div>
    </div>
  );
}

export default SignupPage;