import { useState } from "react";
import "../../css/inhance_img/ColorPickerAndRangeStyle.css";

function Range({ title2 ,text , maxValue , minValue  ,  range , setRange}) {
    return (
        <div className="color-range-box">
            <p>{title2}</p>

            <div className="range-row">
                <span className="range-value">{range} {text}</span>
                <input
                    type="range"
                    min={minValue}
                    max={maxValue}
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="range-input"
                />
            </div>
        </div>
    );
}

export default Range;
