import SidebarHeader from "./SidebarHeader";
import ProductPlane from "./ProductPlane";
import BackgroundPlane from "./BackgroundPlane";
import TextPlane from "./TextPlane";
import { useState } from "react";
import StylePlane from "./StylePlane";
import ExtraPlane from "./ExtraPlane";

function Sidebar({ isPro, settings, updateSetting }) {
    const [tab, setTab] = useState("product");
    return (
        <div className="sidebar flex-column d-flex">
            <SidebarHeader tab={tab} setTab={setTab} isPro={isPro} />

            {tab === "product" && (
                <ProductPlane settings={settings} updateSetting={updateSetting} />
            )}
            {tab === "background" && (
                <BackgroundPlane settings={settings} updateSetting={updateSetting} />
            )}
            {tab === "style" && (
                <StylePlane settings={settings} updateSetting={updateSetting} />
            )}
            {tab === "text" && (
                <TextPlane settings={settings} updateSetting={updateSetting} />
            )}
            {tab === "extra" && (
                <ExtraPlane isPro={isPro} settings={settings} updateSetting={updateSetting} />
            )}
        </div>
    );
}

export default Sidebar;