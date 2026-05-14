function PricingCard({
    title,
    price,
    features,
    buttonText,
    className = "",
    image,
    onSubscribe,
    disabled = false,
}) {
    return (
        <div className={`pricing-card ${className}`}>
            <div className="card-body">
                {image && <img src={image} alt="" className="card-img" />}

                {title && <h2>{title}</h2>}
                {price && <h3>{price}</h3>}

                {features && features.length > 0 && (
                    <ul>
                        {features.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                )}

                {buttonText && (
                    <button
                        type="button"
                        className="trial-btn"
                        onClick={onSubscribe}
                        disabled={disabled}
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
}

export default PricingCard;