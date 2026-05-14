import TitleAndInputField from "./TitleAndInputField";
import TextPositionSelector from "./TextPositionSelector";
import ColorPickerAndRange from "./ColorPickerAndRange";
import ToggleSwitch from "./ToggleSwitch";

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
            <ColorPickerAndRange
                title1='Text Color (Optional)'
                title2='Text Size (Optional)'
                text='px'
                maxValue={100}
                minValue={12}
                color={settings.textColor}
                setColor={(v) => updateSetting("textColor", v)}
                range={settings.textSize}
                setRange={(v) => updateSetting("textSize", v)}
            />
        </div>
    );
}

export default TextPlane;