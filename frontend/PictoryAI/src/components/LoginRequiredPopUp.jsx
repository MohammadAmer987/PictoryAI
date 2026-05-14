// LoginRequiredPopup.jsx

export default function LoginRequiredPopup({
    isOpen,
    onClose,
    onLogin
}) {
    if (!isOpen) return null

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <button
                    onClick={onClose}
                    style={styles.closeBtn}
                >
                    ✕
                </button>

                <div style={styles.icon}>
                    🔒
                </div>

                <h2 style={styles.title}>
                    Login Required
                </h2>

                <p style={styles.text}>
                    You need to log in first to use this tool.
                </p>

                <div style={styles.actions}>
                    <button
                        style={styles.loginBtn}
                        onClick={onLogin}
                    >
                        Login
                    </button>

                    <button
                        style={styles.cancelBtn}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
    },

    popup: {
        width: "90%",
        maxWidth: "400px",
        background: "#fff",
        borderRadius: "18px",
        padding: "30px",
        position: "relative",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
    },

    closeBtn: {
        position: "absolute",
        top: "12px",
        right: "12px",
        border: "none",
        background: "transparent",
        fontSize: "18px",
        cursor: "pointer"
    },

    icon: {
        fontSize: "50px",
        marginBottom: "15px"
    },

    title: {
        margin: "0 0 10px",
        color: "#043F34"
    },

    text: {
        color: "#555",
        marginBottom: "25px"
    },

    actions: {
        display: "flex",
        gap: "12px",
        justifyContent: "center"
    },

    loginBtn: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "10px",
        background: "#043F34",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold"
    },

    cancelBtn: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "10px",
        background: "#ddd",
        cursor: "pointer",
        fontWeight: "bold"
    }
}