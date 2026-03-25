import { useNavigate } from "react-router-dom";
function LoginPage() {
  const navigate = useNavigate(); 

  return (
    <>
      <div style={{ minHeight: "100vh", background: "#f7fbf8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <div style={{ width: "100%", maxWidth: "420px", backgroundColor: "white", borderRadius: "20px", padding: "35px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", border: "1px solid #afcab8" }}>
          
          <h1 style={{ color: "#045f34", marginBottom: "10px" }}>Login</h1>

          <p style={{ color: "#666", marginBottom: "25px" }}>
            Welcome back! Please enter your account details.
          </p>

          <input type="email" placeholder="Enter your email" style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #afcab8", marginBottom: "15px" }} />

          <input type="password" placeholder="Enter your password" style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #afcab8", marginBottom: "20px" }} />

          <button style={{ width: "100%", backgroundColor: "#045f34", color: "white", border: "none", padding: "14px", borderRadius: "12px", cursor: "pointer", marginBottom: "18px" }}>
            Login
          </button>

          <p style={{ textAlign: "center", color: "#555" }}>
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: "#045f34", fontWeight: "bold", cursor: "pointer" }}
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
              fontWeight: "600"
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