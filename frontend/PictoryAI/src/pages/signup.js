
const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #afcab8",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box",
};

function SignupPage() {
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
        }}
      >
        <h1 style={{ color: "#045f34", marginBottom: "10px" }}>Sign Up</h1>
        <p style={{ color: "#666", marginBottom: "25px" }}>
          Create your account to start using Pictory AI.
        </p>

        <div style={{ display: "grid", gap: "15px" }}>
          <input type="text" placeholder="Owner Name" style={inputStyle} />
          <input type="text" placeholder="Store Name" style={inputStyle} />
          <input type="email" placeholder="Email" style={inputStyle} />
          <input type="password" placeholder="Password" style={inputStyle} />
          <input type="text" placeholder="Business Type" style={inputStyle} />
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
            marginTop: "20px",
          }}
        >
          Create Account
        </button>

        <p style={{ textAlign: "center", marginTop: "15px", color: "#71967d" }}>
          Back to Home
        </p>
      </div>
    </div>
  );
}
export default SignupPage;