import "../../../css/inhance_img/SidebarHeaderStyle.css";

function SidebarHeader({ tab, setTab, isPro }) {
    return (
        <div className="sidebar-tabs">
            <button
                className={`tab-btn ${tab === "product" ? "active" : ""}`}
                onClick={() => setTab("product")}
            >
                Product
            </button>

            <button
                className={`tab-btn ${tab === "background" ? "active" : ""}`}
                onClick={() => setTab("background")}
            >
                Background
            </button>

            <button
                className={`tab-btn ${tab === "style" ? "active" : ""}`}
                onClick={() => setTab("style")}
            >
                Style
            </button>

            <button
                className={`tab-btn ${tab === "text" ? "active" : ""}`}
                onClick={() => setTab("text")}
            >
                Text
            </button>

            <button
                className={`tab-btn ${tab === "extra" ? "active" : ""} ${!isPro ? "tab-locked" : ""}`}
                onClick={() => setTab("extra")}
            >
                Extra
                {!isPro && <span className="lock-dot">🔒</span>}
            </button>
        </div>
    );
}

export default SidebarHeader;