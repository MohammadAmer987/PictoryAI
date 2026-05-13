import '../css/inhance_img/InhanceImgPage.css';
import Sidebar from '../components/inhance_img/Sidebar';
import MainArea from '../components/inhance_img/MainArea';
import { useState, useEffect } from "react";
import Hero from "../components/ReusableHero";

function App({ addNotification = () => {} }) {
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user/subscription', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Accept': 'application/json',
                    },
                });
                const data = await response.json();
                setIsPro(data.isPro);
            } catch (error) {
                setIsPro(false);
            }
        };

        fetchSubscription();
    }, []);

    // ── Centralized settings state ──────────────────────
    const [settings, setSettings] = useState({
        productName: "",
        audience: "",
        productDescription: "",
        background: "",
        backgroundBlur: 0,
        lightType: "",
        styleType: "",
        textOnImage: "",
        textPosition: "",
        textSize: 12,
        cameraAngle: "",
        imageRatio: "",
        extraPrompt: "",
    });

    const updateSetting = (key, value) =>
        setSettings((prev) => ({ ...prev, [key]: value }));

    function isSettingsComplete() {
        return (
            settings.productName.trim() !== "" &&
            settings.audience !== "" &&
            settings.background !== "" &&
            settings.lightType !== "" &&
            settings.styleType !== "" &&
            settings.extraPrompt !== "" &&
            (isPro ? settings.imageRatio !== "" : true)
        );
    }

    return (
        <div className="enhance-page-wrapper">
            <Hero
                title="AI Image Enhancer"
                description="Upload your product image and enhance it into a professional marketing visual using AI."
                breadcrumb={[
                    { label: "Home", path: "/" },
                    { label: "AI Tools", path: "/tools" },
                    { label: "Enhance Image", active: true }
                ]}
                features={[
                    { icon: "bi-palette", title: "Custom Style", subtitle: "Background & Colors" },
                    { icon: "bi-brush", title: "Retouch", subtitle: "Clean Look" },
                    { icon: "bi-stars", title: "AI Magic", subtitle: "Smart Enhance" },
                ]}
            />


            <div className="row g-0 main-content-wrapper">
                <div className="col-lg-3 col-md-4">
                    <Sidebar isPro={isPro} settings={settings} updateSetting={updateSetting} />
                </div>
                <div className="col-lg-9 col-md-8">
                    <MainArea
                        isPro={isPro}
                        isReady={isSettingsComplete()}
                        settings={settings}
                        addNotification={addNotification}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;