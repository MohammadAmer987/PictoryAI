import Group from "./Group";
import Range from "./Range";
import sea from "../../assets/inhance_img/backgrounds/Sea.jpg";
import mountains from "../../assets/inhance_img/backgrounds/Mountains.jpg";
import forest from "../../assets/inhance_img/backgrounds/Forest.jpg";
import studio from "../../assets/inhance_img/backgrounds/Studio.jpg";
import wood from "../../assets/inhance_img/backgrounds/Wood.jpg";
import office from "../../assets/inhance_img/backgrounds/Office.jpg";
import home from "../../assets/inhance_img/backgrounds/Home.jpg";
import sky from "../../assets/inhance_img/backgrounds/Sky.jpg";
import fabric from "../../assets/inhance_img/backgrounds/Fabric.jpg";
import cafe from "../../assets/inhance_img/backgrounds/Cafe.jpg";
import marble from "../../assets/inhance_img/backgrounds/Marble.jpg";
import desert from "../../assets/inhance_img/backgrounds/Desert.jpg";
import street from "../../assets/inhance_img/backgrounds/Street.jpg";

const backgrounds = [
    { name: 'Sea',       image: sea },
    { name: 'Mountains', image: mountains },
    { name: 'Forest',    image: forest },
    { name: 'Studio',    image: studio },
    { name: 'Wood',      image: wood },
    { name: 'Office',    image: office },
    { name: 'Home',      image: home },
    { name: 'Sky',       image: sky },
    { name: 'Fabric',    image: fabric },
    { name: 'Cafe',      image: cafe },
    { name: 'Marble',    image: marble },
    { name: 'Desert',    image: desert },
    { name: 'Street',    image: street },
];

function BackgroundPlane({ settings, updateSetting }) {
    return (
        <div className='BackgroundPlane d-flex flex-column'>
            <Group
                title='Background Type:'
                imgWidth={70}
                array={backgrounds}
                colsNum={4}
                onClick={(v) => updateSetting("background", v)}
                selected={settings.background}
            />
            <Range
                title2='Background Blur (Optional)'
                text=''
                maxValue={10}
                minValue={0}
                range={settings.backgroundBlur}
                setRange={(v) => updateSetting("backgroundBlur", v)}
            />
        </div>
    );
}

export default BackgroundPlane;