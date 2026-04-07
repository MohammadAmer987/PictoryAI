import "../../css/inhance_img/RatioCardStyle.css";

function RatioCard({ ratio, label, selected, onClick }) {
    return (
        <div
            className={`ratio-card ${selected ? "active" : ""}`}
            onClick={onClick}
        >
            <div className={`ratio-box ratio-${ratio.replace(":", "-")}`}>
                {ratio}
            </div>

            <p className="ratio-label">{label}</p>
        </div>
    );
}

export default RatioCard;