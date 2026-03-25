import "../../css/Pricingpartstyle.css";
import PricingCard from "./PricingCard";

function Pricingpart() {

    const features = [
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4"
    ];

    return (
        <div className="top-Pricingpart">

            <div className="left">
                <PricingCard
                    title="Free Trial"
                    price="$0 / 7 Days"
                    features={features}
                    variant="secondary"
                    buttonText="Start Free Trial"

                />


            </div>

            <div className="right">
                <PricingCard
                    title="Premium"
                    price="$19 / Month"
                    features={features}
                    variant="primary"
                    buttonText="Subscribe Now"

                />
            </div>



        </div>
    );
}

export default Pricingpart;