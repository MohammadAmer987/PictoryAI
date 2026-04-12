import RatioCard from "./RatioCard";
import "../../css/inhance_img/RatioGroup.css";

const ratios = [
    { ratio: "1:1",  label: "Square" },
    { ratio: "16:9", label: "Landscape" },
    { ratio: "4:5",  label: "Instagram" },
    { ratio: "9:16", label: "Story" },
    { ratio: "3:4",  label: "Portrait" },
];

function RatioGroup({ selected, onChange }) {
    return (
        <div className='m-3'>
            <p>Image Dimensions:</p>
            <div className="ratio-group">
                {ratios.map(({ ratio, label }) => (
                    <RatioCard
                        key={ratio}
                        ratio={ratio}
                        label={label}
                        selected={selected === ratio}
                        onClick={() => onChange(ratio)}
                    />
                ))}
            </div>
        </div>
    );
}

export default RatioGroup;