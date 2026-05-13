import "../../css/Pricingpartstyle.css";
import AnimatedBackground from "../AnimatedBackground";
import PricingCard from "./PricingCard";
import DirectionImage from "../../images/Direction.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Pricingpart() {
    const navigate = useNavigate();
    const [loadingPlan, setLoadingPlan] = useState(null);

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
        "Watermarked images",
    ];

    const getToken = () => {
        return (
        localStorage.getItem("access_token")
        );
    };

const handleSubscribe = async (selectedPlan) => {
    const token = getToken();

    if (!token) {
        navigate("/signup");
        return;
    }

    try {
        setLoadingPlan(selectedPlan);

        const response = await fetch(
            "http://127.0.0.1:8000/api/subscriptions/current",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 401) {
            navigate("/signup");
            return;
        }

        const result = await response.json();

        if (!response.ok) {
            console.error("Subscription check failed:", result);
            alert(result?.message || "Failed to check subscription.");
            return;
        }

        const currentPlan =
            result?.data?.subscription?.plan?.name?.toLowerCase();

        if (!currentPlan) {
            alert("No active subscription found.");
            return;
        }

        if (currentPlan === selectedPlan) {
            alert(`You are already on the ${selectedPlan} plan.`);
            return;
        }

        if (selectedPlan === "premium") {
            navigate("/payment");
            return;
        }

        alert("You already have Premium plan.");
    } catch (error) {
        console.error("Network or server error:", error);
        alert("Something went wrong while checking your subscription.");
    } finally {
        setLoadingPlan(null);
    }
};

    return (
        <div className="top-Pricingpart">
            <div className="left-content">
                <img src={DirectionImage} alt="" className="direction-image" />
            </div>

            <AnimatedBackground />

            <div className="left">
                <PricingCard
                    title="Free Tier"
                    price="$0"
                    features={FreePlan}
                    className="secondary"
                    buttonText={
                        loadingPlan === "free" ? "Checking..." : "Subscribe Now"
                    }
                    disabled={loadingPlan !== null}
                    onSubscribe={() => handleSubscribe("free")}
                />
            </div>

            <div className="right">
                <PricingCard
                    title="Premium Tier"
                    price="$29 / Month"
                    features={ProPlan}
                    className="primary"
                    buttonText={
                        loadingPlan === "premium" ? "Checking..." : "Subscribe Now"
                    }
                    disabled={loadingPlan !== null}
                    onSubscribe={() => handleSubscribe("premium")}
                />
            </div>
        </div>
    );
}

export default Pricingpart;