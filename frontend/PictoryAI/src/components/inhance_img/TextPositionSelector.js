import TextPositionCard from "./TextPositionCard";
import '../../../css/inhance_img/TextPositionSelectorStyle.css';

const positions = [
    { label: "Center",        value: "center" },
    { label: "Top Center",    value: "top-center" },
    { label: "Bottom Center", value: "bottom-center" },
    { label: "Bottom Left",   value: "bottom-left" },
    { label: "Bottom Right",  value: "bottom-right" },
    { label: "Top Left",      value: "top-left" },
    { label: "Top Right",     value: "top-right" },
    { label: "Middle Left",   value: "middle-left" },
    { label: "Middle Right",  value: "middle-right" },
];

function TextPositionSelector({ selected, onChange }) {
    return (
        <div className='m-3'>
            <p>Text Position:</p>
            <div className='group'>
                {positions.map((item) => (
                    <TextPositionCard
                        key={item.value}
                        label={item.label}
                        position={item.value}
                        selected={selected === item.value}
                        onClick={() => onChange(item.value)}
                    />
                ))}
            </div>
        </div>
    );
}

export default TextPositionSelector;