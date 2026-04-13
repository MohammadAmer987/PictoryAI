import '../../css/module3styles.css'

import { useState, useRef } from "react";
/**
 * ColorPicker
 *
 * Props:
 *  selectedColor (string) – currently selected hex value
 *  onChange (function)    – called with the hex string when a color is picked
 */


function hexToHsva(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0, s = max === 0 ? 0 : d / max, v = max;
    if (max !== min) {
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
    }
    return { h: h * 360, s, v };
}

function hsvaToHex({ h, s, v }) {
    const f = (n) => {
        const k = (n + h / 60) % 6;
        return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    };
    const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
    return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`.toUpperCase();
}

function isLight(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

function buildApiColorPayload(hex) {
    const colorName = describeColor(hex);

    return {
        hex,
        colorName,
        promptText: `Use ${colorName} as the main dominant color in the image design.`,
        paletteText: `Match the visual style closely to a ${colorName} palette. Avoid shifting to pink, purple, magenta, or unrelated colors.`,
    };
}

function describeColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const lightness = (max + min) / 510;

    let hue = 0;

    if (delta !== 0) {
        if (max === r) {
            hue = 60 * (((g - b) / delta) % 6);
        } else if (max === g) {
            hue = 60 * (((b - r) / delta) + 2);
        } else {
            hue = 60 * (((r - g) / delta) + 4);
        }
    }

    if (hue < 0) {
        hue += 360;
    }

    const tone = lightness < 0.25
        ? "very dark"
        : lightness < 0.42
            ? "deep"
            : lightness > 0.78
                ? "very light"
                : lightness > 0.62
                    ? "light"
                    : "rich";

    const family = hue >= 330 || hue < 15
        ? "red"
        : hue < 40
            ? "orange"
            : hue < 65
                ? "yellow"
                : hue < 90
                    ? "lime green"
                    : hue < 150
                        ? "green"
                        : hue < 185
                            ? "teal"
                            : hue < 210
                                ? "cyan blue"
                                : hue < 250
                                    ? "blue"
                                    : hue < 285
                                        ? "indigo"
                                        : hue < 320
                                            ? "purple"
                                            : "pink";

    return `${tone} ${family}`;
}

export default function ColorPicker({ selectedColor = "#043F34", onChange }) {
    const [hsva, setHsva]         = useState(() => hexToHsva(selectedColor));
    const [hexInput, setHexInput] = useState(selectedColor.toUpperCase());
    const [inputError, setInputError] = useState(false);

    const gradientRef = useRef(null);
    const hueRef      = useRef(null);

    const currentHex = hsvaToHex(hsva);

    const updateColor = (newHsva) => {
        setHsva(newHsva);
        const hex = hsvaToHex(newHsva);
        setHexInput(hex);
        setInputError(false);
        onChange?.(hex, buildApiColorPayload(hex));
    };

    /* ── Gradient (SV) drag ── */
    const handleGradientPointer = (e) => {
        const rect = gradientRef.current.getBoundingClientRect();
        const s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const v = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
        updateColor({ ...hsva, s, v });
    };
    const startGradientDrag = (e) => {
        handleGradientPointer(e);
        const move = (ev) => handleGradientPointer(ev);
        const up   = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
    };

    /* ── Hue drag ── */
    const handleHuePointer = (e) => {
        const rect = hueRef.current.getBoundingClientRect();
        const h = Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360));
        updateColor({ ...hsva, h });
    };
    const startHueDrag = (e) => {
        handleHuePointer(e);
        const move = (ev) => handleHuePointer(ev);
        const up   = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
    };

    /* ── Hex input ── */
    const handleHexInput = (e) => {
        const val = e.target.value.toUpperCase();
        setHexInput(val);
        const clean = val.startsWith("#") ? val : `#${val}`;
        if (/^#[0-9A-F]{6}$/.test(clean)) {
            setInputError(false);
            setHsva(hexToHsva(clean));
            onChange?.(clean, buildApiColorPayload(clean));
        } else {
            setInputError(true);
        }
    };

    const hueColor    = hsvaToHex({ h: hsva.h, s: 1, v: 1 });
    const thumbLeft   = `${hsva.s * 100}%`;
    const thumbTop    = `${(1 - hsva.v) * 100}%`;
    const hueLeft     = `${(hsva.h / 360) * 100}%`;
    const light       = isLight(currentHex);

    return (
        <div className="cp-wrapper">
            <label className="cp-label">Color</label>

            {/* ── SV Gradient ── */}
            <div
                className="cp-gradient"
                ref={gradientRef}
                style={{ "--hue-color": hueColor }}
                onPointerDown={startGradientDrag}
            >
                <div className="cp-gradient-white" />
                <div className="cp-gradient-black" />
                <div
                    className="cp-thumb"
                    style={{
                        left: thumbLeft,
                        top: thumbTop,
                        "--thumb-color": currentHex,
                        "--thumb-ring": light ? "#9abfaf" : "#fff",
                    }}
                />
            </div>

            {/* ── Hue slider ── */}
            <div className="cp-hue-track" ref={hueRef} onPointerDown={startHueDrag}>
                <div className="cp-hue-thumb" style={{ left: hueLeft, "--hue-color": hueColor }} />
            </div>

            {/* ── Preview + Hex input ── */}
            <div className="cp-bottom">
                <div
                    className="cp-preview"
                    style={{
                        background: currentHex,
                        boxShadow: light
                            ? "inset 0 0 0 1.5px #D6EAE0"
                            : "0 2px 8px rgba(4,63,52,0.18)",
                    }}
                />
                <div className={`cp-hex-wrap ${inputError ? "cp-hex-wrap--error" : ""}`}>
                    <span className="cp-hash">#</span>
                    <input
                        className="cp-hex-input"
                        value={hexInput.replace("#", "")}
                        onChange={handleHexInput}
                        maxLength={6}
                        spellCheck={false}
                        aria-label="Hex color value"
                    />
                </div>
            </div>


        </div>
    );
}
