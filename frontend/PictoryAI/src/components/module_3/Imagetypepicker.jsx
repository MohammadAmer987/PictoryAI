import { useState } from "react";
import '../../css/module3styles.css'

const IMAGE_TYPES = [
    { id: "post",      label: "Post",      ratio: "1:1",  w: 1,  h: 1,  desc: "Square"     },
    { id: "story",     label: "Story",     ratio: "9:16", w: 9,  h: 16, desc: "Vertical"   },
    { id: "banner",    label: "Banner",    ratio: "16:9", w: 16, h: 9,  desc: "Landscape"  },
    { id: "portrait",  label: "Portrait",  ratio: "4:5",  w: 4,  h: 5,  desc: "Tall"       },
    { id: "landscape", label: "Landscape", ratio: "3:2",  w: 3,  h: 2,  desc: "Wide"       },
    { id: "cinema",    label: "Cinema",    ratio: "21:9", w: 21, h: 9,  desc: "Ultra-wide" },
];


const BASE = 30;

function AspectShape({ w, h, active }) {
    const scale = BASE / Math.max(w, h);
    const width  = Math.round(w * scale);
    const height = Math.round(h * scale);
    return (
        <div className="itp-shape-wrap">
            <div
                className={`itp-shape${active ? " itp-shape--active" : ""}`}
                style={{ width, height }}
            />
        </div>
    );
}

export default function ImageTypePicker({ value, onChange }) {
    const [selected, setSelected] = useState(value ?? "post");

    const handleSelect = (id) => {
        setSelected(id);
        onChange?.(id);
    };

    const current = IMAGE_TYPES.find((t) => t.id === selected);

    return (
        <div className="itp-wrap">
            <span className="itp-label">Image type</span>

            <div className="itp-grid">
                {IMAGE_TYPES.map((type, i) => (
                    <div key={type.id} style={{ display: "contents" }}>
                        {i === 3 && <div className="itp-row-divider" />}
                        <button
                            className={`itp-btn${selected === type.id ? " itp-btn--active" : ""}`}
                            onClick={() => handleSelect(type.id)}
                            aria-pressed={selected === type.id}
                        >
                            <AspectShape w={type.w} h={type.h} active={selected === type.id} />
                            <span className="itp-name">{type.label}</span>
                            <span className="itp-ratio">{type.ratio}</span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="itp-hint">
                {current ? `${current.desc} · ${current.ratio}` : ""}
            </div>
        </div>
    );
}
