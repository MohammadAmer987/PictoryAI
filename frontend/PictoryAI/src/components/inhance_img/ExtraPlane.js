import TitleAndTextArea from "./TitleAndTextArea";
import "../../css/inhance_img/ExtraPlaneStyle.css";
import RatioGroup from "./RatioGroup";
import Group from "./Group";
import Front from "../../assets/inhance_img/angles/Front.jpg";
import Angle45 from "../../assets/inhance_img/angles/Angle45.jpg";
import FlatLay from "../../assets/inhance_img/angles/Flat Lay.jpg";
import Side from "../../assets/inhance_img/angles/Side.jpg";
import Top from "../../assets/inhance_img/angles/Top.jpg";

const angles = [
    { name: 'Front',      image: Front },
    { name: '45° Angle',  image: Angle45 },
    { name: 'Flat Lay',   image: FlatLay },
    { name: 'Side',       image: Side },
    { name: 'Top',        image: Top },
];

function ExtraPlane({ isPro, settings, updateSetting }) {
    if (!isPro) {
        return (
            <div className="extra-locked">
                <div className="lock-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                </div>
                <h3>Pro Feature</h3>
                <p>Extra settings — including custom image count and advanced controls — are available exclusively for Pro users.</p>
                <button className="upgrade-btn">✦ Upgrade to Pro</button>
            </div>
        );
    }

    return (
        <div className="ExtraPlane d-flex flex-column">
            <TitleAndTextArea
                title="Describe the image in your own words (optional)"
                placeholder="Describe your idea... e.g. a perfume placed on the beach in a basket"
                value={settings.extraPrompt}
                onChange={(v) => updateSetting("extraPrompt", v)}
            />
            <RatioGroup
                selected={settings.imageRatio}
                onChange={(v) => updateSetting("imageRatio", v)}
            />
            <Group
                title='Camera Angle:'
                imgWidth={80}
                array={angles}
                colsNum={3}
                onClick={(v) => updateSetting("cameraAngle", v)}
                selected={settings.cameraAngle}
            />
        </div>
    );
}

export default ExtraPlane;