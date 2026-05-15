import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Services/authService";

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await login(formData);

      const user = data?.data?.user;

      if (!user) {
        setError("Login succeeded, but user data was not returned.");
        return;
      }

      if (onLoginSuccess) {
        onLoginSuccess(user);
      }

      const roleId = Number(user.role_id);

      if (roleId === 1) {
        navigate("/admin");
        return;
      }

      if (roleId === 2) {
        navigate("/tools");
        return;
      }

      setError("Your account role is not allowed to access this system.");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          zIndex: "1",
          minHeight: "100vh",
          background: "#f7fbf8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "35px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            border: "1px solid #afcab8",
            position: "relative",
            zIndex: "2",
          }}
        >
          <h1 style={{ color: "#045f34", marginBottom: "10px" }}>Login</h1>

          <p style={{ color: "#666", marginBottom: "25px" }}>
            Welcome back! Please enter your account details.
          </p>

          {error && (
            <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #afcab8",
              marginBottom: "15px",
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #afcab8",
              marginBottom: "20px",
            }}
          />

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
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "18px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={{ textAlign: "center", color: "#555" }}>
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{
                color: "#045f34",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Sign Up
            </span>
          </p>

          <p
            onClick={() => navigate("/")}
            style={{
              textAlign: "center",
              marginTop: "15px",
              color: "#71967d",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Back to Home
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;