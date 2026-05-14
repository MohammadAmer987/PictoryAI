import "../../css/Pricingpartstyle.css";
import AnimatedBackground from "../AnimatedBackground";
import PricingCard from "./PricingCard";
import DirectionImage from "../../images/Direction.png";
function Pricingpart() {

    const ProPlan = [
        "Unlimited image generation",
        "Unlimited Captions generation",
        "Add your logo to images",
        "Full image description control",
        "No watermarks",
    ];

    const FreePlan = [
        "5 Image generations per month",
        "10 Captions generation per month",
        "Basic image editing",
        "Watermarked images"
    ];

    return (

        <div className="top-Pricingpart">
            <div className="left-content"><img src={DirectionImage} alt="" className="direction-image"/></div>
            <AnimatedBackground />
            <div className="left">
                <PricingCard
                    title="Free Tier"
                    price="$0"
                    features={FreePlan}
                    variant="secondary"
                    buttonText="Subscribe Now"
                    link="/signup"
                />
            </div>

            <div className="right">
                <PricingCard
                    title="Premium Tier"
                    price="$19 / Month"
                    features={ProPlan}
                    variant="primary"
                    buttonText="Subscribe Now"
                    link="/signup"
                />
            </div>

        </div>
    );
}

export default Pricingpart;