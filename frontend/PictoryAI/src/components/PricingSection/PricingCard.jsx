import { Link } from "react-router-dom";

function PricingCard({
                         title,
                         price,
                         features,
                         buttonText,
                         className = "",
                         image,
                         link
                     }) {
    return (

        <Link to={link || "#"} className="card-link">

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
                        <button className="trial-btn">
                            {buttonText}
                        </button>
                    )}

                </div>

            </div>

        </Link>
    );
}

export default PricingCard;