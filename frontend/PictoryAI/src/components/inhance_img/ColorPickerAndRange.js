import { useState } from "react";
import "../../css/inhance_img/ColorPickerAndRangeStyle.css";

function ColorPickerAndRange({ title1, title2 ,text , maxValue , minValue , color , setColor ,  range , setRange}) {
    return (
        <div className="color-range-box">
            <p>{title1}</p>

            <div className="color-picker-row">
                <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="hex-input"
                />

                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="color-input"
                />
            </div>

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

export default ColorPickerAndRange;
