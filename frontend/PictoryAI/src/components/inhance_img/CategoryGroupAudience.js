import CardWithIcon from "./CardWithIcon";
import { FaFemale, FaMale, FaUsers } from "react-icons/fa";
import { PiBaby } from "react-icons/pi";
import { HiUsers } from "react-icons/hi2";
import "../../../css/inhance_img/CategoryGroupAudienceStyle.css";

function CategoryGroupAudience({ selected, onChange }) {
    return (
        <div className='m-3'>
            <p>Target Audience:</p>
            <div className="category-group">
                <CardWithIcon icon={<FaFemale size={25} />} label='Women'  selected={selected === "Women"}  onClick={() => onChange("Women")}  />
                <CardWithIcon icon={<FaMale   size={25} />} label='Men'    selected={selected === "Men"}    onClick={() => onChange("Men")}    />
                <CardWithIcon icon={<PiBaby   size={25} />} label='Kids'   selected={selected === "Kids"}   onClick={() => onChange("Kids")}   />
                <CardWithIcon icon={<FaUsers  size={25} />} label='Family' selected={selected === "Family"} onClick={() => onChange("Family")} />
                <CardWithIcon icon={<HiUsers  size={25} />} label='Unisex' selected={selected === "Unisex"} onClick={() => onChange("Unisex")} />
            </div>
        </div>
    );
}

export default CategoryGroupAudience;