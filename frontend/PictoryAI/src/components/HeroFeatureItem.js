import React from "react";

function HeroFeatureItem({ icon, title, subtitle }) {
    return (
        <div className="feature-item flex-grow-1">
            <div
                className="shadow-sm rounded-4 mb-2 d-flex align-items-center justify-content-center icon-box-bg mx-auto"
                style={{
                    aspectRatio: "1 / 1",
                    width: "100%",
                    maxWidth: "45px",
                    padding: "8%",
                }}
            >
                <i className={`bi ${icon} icon-color fs-6`}></i>
            </div>

            <small className="fw-semibold d-block hero-title text-nowrap extra-small-title">
                {title}
            </small>
            <small className="extra-small text-secondary d-block text-nowrap">
                {subtitle}
            </small>
        </div>
    );
}

export default HeroFeatureItem;