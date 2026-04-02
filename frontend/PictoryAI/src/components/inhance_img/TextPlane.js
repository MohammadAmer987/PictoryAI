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
                title1='Text Color:'
                title2='Text Size:'
                text='px'
                maxValue={72}
                minValue={12}
                color={settings.textColor}
                setColor={(v) => updateSetting("textColor", v)}
                range={settings.textSize}
                setRange={(v) => updateSetting("textSize", v)}
            />
            <div className='m-3'>
                <ToggleSwitch
                    label='Text Shadow'
                    checked={settings.textShadow}
                    onChange={() => updateSetting("textShadow", !settings.textShadow)}
                />
                <ToggleSwitch
                    label='Text Background'
                    checked={settings.textBackground}
                    onChange={() => updateSetting("textBackground", !settings.textBackground)}
                />
            </div>
        </div>
    );
}

export default TextPlane;