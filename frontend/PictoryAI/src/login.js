function LoginPage() {
  return (
<>
    <div
      style={{
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
        }}
      >
        <h1 style={{ color: "#045f34", marginBottom: "10px" }}>Login</h1>

        <p style={{ color: "#666", marginBottom: "25px" }}>
          Welcome back! Please enter your account details.
        </p>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#045f34",
            }}
          >
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #afcab8",
              outline: "none",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#045f34",
            }}
          >
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #afcab8",
              outline: "none",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          style={{
            width: "100%",
            backgroundColor: "#045f34",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "12px",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "18px",
          }}
        >
          Login
        </button>

        <p style={{ textAlign: "center", color: "#555" }}>
          Don’t have an account?{" "}
          <span style={{ color: "#045f34", fontWeight: "bold" }}>
            Sign Up
          </span>
        </p>

        <p style={{ textAlign: "center", marginTop: "15px", color: "#71967d" }}>
          Back to Home
        </p>
      </div>
    </div>
    </>
  );
}

export default LoginPage;