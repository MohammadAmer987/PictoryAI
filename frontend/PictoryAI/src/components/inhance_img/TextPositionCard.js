import "../../css/inhance_img/TextPositionCardStyle.css";

function TextPositionCard({ label, position, selected, onClick }) {
    return (
        <div
            className={`text-pos-card ${selected ? "active" : ""}`}
            onClick={onClick}
        >
            <div className="preview-box">
                <div className={`text-placeholder ${position}`}></div>
            </div>
            <p>{label}</p>
        </div>
    );
}

export default TextPositionCard;