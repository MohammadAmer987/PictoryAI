import TitleAndInputField from "./TitleAndInputField";
import TextPositionSelector from "./TextPositionSelector";
import ColorPickerAndRange from "./ColorPickerAndRange";
import ToggleSwitch from "./ToggleSwitch";
import Range from "./Range";

function TextPlane({ settings, updateSetting }) {
    return (
        <div className='TextPlane d-flex flex-column'>
            <TitleAndInputField
                title={'Text on Image (Optional)'}
                placeholder={'Example: Limited Offer'}
                value={settings.textOnImage}
                onChange={(v) => updateSetting("textOnImage", v)}
            />
            <TextPositionSelector
                selected={settings.textPosition}
                onChange={(v) => updateSetting("textPosition", v)}
            />
            <Range
                title2='Text Size (Optional)'
                text='px'
                maxValue={100}
                minValue={12}
                range={settings.textSize}
                setRange={(v) => updateSetting("textSize", v)}
            />
        </div>
    );
}

export default TextPlane;