import "../../css/inhance_img/ToggleSwitchStyle.css";

function ToggleSwitch({ label, checked, onChange }) {
    return (
        <div className="toggle-row">
            <span>{label}</span>

            <button
                type="button"
                className={`toggle-switch ${checked ? "active" : ""}`}
                onClick={onChange}
            >
                <span className="toggle-circle"></span>
            </button>
        </div>
    );
}

export default ToggleSwitch;