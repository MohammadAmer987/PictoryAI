import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/paymentPage.css";

function PaymentPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        cardNumber: "",
        holderName: "",
        expiry: "",
        cvv: "",
    });

    const [loading, setLoading] = useState(false);

    const token = useMemo(() => {
        return (
            localStorage.getItem("token") ||
            localStorage.getItem("auth_token") ||
            localStorage.getItem("access_token")
        );
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!form.cardNumber.trim()) return "Card number is required.";
        if (!form.holderName.trim()) return "Card holder name is required.";
        if (!form.expiry.trim()) return "Expiry date is required.";
        if (!form.cvv.trim()) return "CVV is required.";

        return null;
    };

    const handleConfirmPayment = async () => {
        const validationError = validateForm();

        if (validationError) {
            alert(validationError);
            return;
        }

        if (!token) {
            navigate("/signup");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("http://127.0.0.1:8000/api/subscriptions/upgrade", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                navigate("/signup");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to upgrade subscription");
            }

            alert("Payment completed successfully. Your plan is now Premium.");
            navigate("/pricing");
        } catch (error) {
            console.error(error);
            alert("Payment simulation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="checkout-page">
            <section className="checkout-hero">
                <div className="checkout-copy">
                    <span className="checkout-badge">● Payment form</span>

                    <h1>
                        Upgrade your creative engine,
                        <span> unlock Premium AI tools.</span>
                    </h1>

                    <p>
                        Enjoy our services with unlimited uses. 

                    </p>

                    <div className="checkout-stats">
                        <div>
                            <strong>∞</strong>
                            <small>Image generations</small>
                        </div>

                        <div>
                            <strong>0</strong>
                            <small>Watermarks</small>
                        </div>

                        <div>
                            <strong>Full</strong>
                            <small>Description control</small>
                        </div>
                    </div>
                </div>

                <div className="checkout-card">
                    <div className="checkout-card-header">
                        <div>
                            <span>Premium Tier</span>
                            <h2>$29 / Month</h2>
                        </div>

                        <div className="checkout-plan-icon">
                            AI
                        </div>
                    </div>

                    <div className="checkout-summary">
                        <div>
                            <span>Plan</span>
                            <strong>Premium</strong>
                        </div>

                        <div>
                            <span>Billing</span>
                            <strong>Monthly</strong>
                        </div>

                        <div>
                            <span>Total</span>
                            <strong>$29.00</strong>
                        </div>
                    </div>

                    <div className="checkout-form">
                        <label>
                            Card Number
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="4242 4242 4242 4242"
                                value={form.cardNumber}
                                onChange={handleChange}
                                maxLength="19"
                            />
                        </label>

                        <label>
                            Card Holder
                            <input
                                type="text"
                                name="holderName"
                                placeholder="Your Name"
                                value={form.holderName}
                                onChange={handleChange}
                            />
                        </label>

                        <div className="checkout-row">
                            <label>
                                Expiry
                                <input
                                    type="text"
                                    name="expiry"
                                    placeholder="MM/YY"
                                    value={form.expiry}
                                    onChange={handleChange}
                                    maxLength="5"
                                />
                            </label>

                            <label>
                                CVV
                                <input
                                    type="password"
                                    name="cvv"
                                    placeholder="123"
                                    value={form.cvv}
                                    onChange={handleChange}
                                    maxLength="4"
                                />
                            </label>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="checkout-button"
                        onClick={handleConfirmPayment}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Confirm Subscription"}
                    </button>

                    
                </div>
            </section>
        </main>
    );
}

export default PaymentPage;