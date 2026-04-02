import SoftNaturalLight from "../../../assets/inhance_img/lights/Soft Natural Light.png";
import StudioLight from "../../../assets/inhance_img/lights/Studio Light.png";
import GoldenHour from "../../../assets/inhance_img/lights/Golden Hour.png";
import DramaticLight from "../../../assets/inhance_img/lights/Dramatic Light.png";
import LowKeyLighting from "../../../assets/inhance_img/lights/Low Key Lighting.png";
import HighKeyLighting from "../../../assets/inhance_img/lights/High Key Lighting.png";
import SoftShadow from "../../../assets/inhance_img/lights/Soft Shadow.png";
import HardLight from "../../../assets/inhance_img/lights/Hard Light.png";
import BackLight from "../../../assets/inhance_img/lights/BackLight.png";
import RimLight from "../../../assets/inhance_img/lights/Rim Light.png";
import Simple from "../../../assets/inhance_img/styles_img/simple.png";
import Modern from "../../../assets/inhance_img/styles_img/modern.png";
import Minimal from "../../../assets/inhance_img/styles_img/minimal.png";
import Luxurios from "../../../assets/inhance_img/styles_img/luxurios.png";
import Cinematic from "../../../assets/inhance_img/styles_img/cinematic.png";
import Classic from "../../../assets/inhance_img/styles_img/classic.png";
import Masculine from "../../../assets/inhance_img/styles_img/masculine.png";
import Feminine from "../../../assets/inhance_img/styles_img/feminine.png";
import InstgramStyle from "../../../assets/inhance_img/styles_img/instgram style.png";
import AdvertisementStyle from "../../../assets/inhance_img/styles_img/advertisement style.png";
import Group from "./Group";

const lights = [
    { name: 'Soft Natural Light',  image: SoftNaturalLight },
    { name: 'Studio Light',        image: StudioLight },
    { name: 'Golden Hour',         image: GoldenHour },
    { name: 'Dramatic Light',      image: DramaticLight },
    { name: 'Low Key Lighting',    image: LowKeyLighting },
    { name: 'High Key Lighting',   image: HighKeyLighting },
    { name: 'Soft Shadow',         image: SoftShadow },
    { name: 'Hard Light',          image: HardLight },
    { name: 'Back Light',          image: BackLight },
    { name: 'Rim Light',           image: RimLight },
];

const styles = [
    { name: 'Simple',              image: Simple },
    { name: 'Modern',              image: Modern },
    { name: 'Minimal',             image: Minimal },
    { name: 'Luxurios',            image: Luxurios },
    { name: 'Cinematic',           image: Cinematic },
    { name: 'Classic',             image: Classic },
    { name: 'Masculine',           image: Masculine },
    { name: 'Feminine',            image: Feminine },
    { name: 'Instgram Style',      image: InstgramStyle },
    { name: 'Advertisement Style', image: AdvertisementStyle },
];

function StylePlane({ settings, updateSetting }) {
    return (
        <div className='StylePlane d-flex flex-column'>
            <Group
                title='Light Type:'
                imgWidth={80}
                array={lights}
                colsNum={3}
                onClick={(v) => updateSetting("lightType", v)}
                selected={settings.lightType}
            />
            <Group
                title='Style Type:'
                imgWidth={80}
                array={styles}
                colsNum={3}
                onClick={(v) => updateSetting("styleType", v)}
                selected={settings.styleType}
            />
        </div>
    );
}

export default StylePlane;