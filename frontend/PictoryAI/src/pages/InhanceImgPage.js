import '../css/inhance_img/InhanceImgPage.css';
import Sidebar from '../components/inhance_img/Sidebar';
import MainArea from '../components/inhance_img/MainArea';
import { useState } from "react";
import Hero from "../components/ReusableHero";


function App() {
    const [isPro, setIsPro] = useState(false);

    // ── Centralized settings state ──────────────────────
    const [settings, setSettings] = useState({
        // Product
        productName: "",
        audience: "",
        productDescription: "",

        // Background
        background: "",
        backgroundColor: "",
        backgroundBlur: 0,

        // Style
        lightType: "",
        styleType: "",

        // Text
        textOnImage: "",
        textPosition: "",
        textColor: "",
        textSize: 18,
        textShadow: false,
        textBackground: false,

        // Extra
        cameraAngle: "",
        imageRatio: "",
        extraPrompt: "",
    });

    const updateSetting = (key, value) =>
        setSettings((prev) => ({ ...prev, [key]: value }));

    const isSettingsComplete = () => {
        return (
            settings.productName.trim() !== "" &&
            settings.audience !== "" &&
            settings.background !== "" &&
            settings.lightType !== "" &&
            settings.styleType !== "" &&
            settings.textPosition !== "" &&
            settings.textColor.trim() !== "" &&
            (isPro ? (settings.cameraAngle !== "" && settings.imageRatio !== "") : true)
        );
    };

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
            />

            {/*<div className="row">*/}
            {/*    <div className="col-12">*/}
            {/*        <header className="app-header">*/}
            {/*            <span>✦ ProductShot AI</span>*/}
            {/*            <button*/}
            {/*                className={`user-type-toggle ${isPro ? "pro" : "free"}`}*/}
            {/*                onClick={() => setIsPro(!isPro)}*/}
            {/*            >*/}
            {/*                {isPro ? "PRO user" : "Free user"} · Click to switch*/}
            {/*            </button>*/}
            {/*        </header>*/}
            {/*    </div>*/}
            {/*</div>*/}


            <div className="row g-0 main-content-wrapper">
                <div className="col-lg-3 col-md-4">
                    <Sidebar isPro={isPro} settings={settings} updateSetting={updateSetting} />
                </div>
                <div className="col-lg-9 col-md-8">
                    <MainArea isPro={isPro} isReady={isSettingsComplete()} />
                </div>
            </div>
        </div>
    );
}

export default App;
