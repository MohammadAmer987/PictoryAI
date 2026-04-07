import React from "react";
import { Col } from "react-bootstrap";
import HeroFeatureItem from "./HeroFeatureItem";

function HeroFeatureList({ items = [] }) {
    return (
        <Col
            lg={4}
            md={12}
            className="d-flex justify-content-lg-end justify-content-center align-items-end"
        >
            <div
                className="d-flex gap-3 text-center justify-content-center w-100 align-items-end"
                style={{ maxWidth: "350px"}}
            >
                {items.map((item, index) => (
                    <HeroFeatureItem
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        subtitle={item.subtitle}
                    />
                ))}
            </div>
        </Col>
    );
}

export default HeroFeatureList;