import React from "react";
import Carousel from "./Carousel";

export default function Hero() {
    return (
        <div className="hero">
            <div className="hero-inner">

                <div className="hero-left">

                    <h1 className="h1">
                        Content that <br/>
                        <em>converts</em>, <br/>
                        made by AI
                    </h1>

                    <p className="sub">
                        Pictory AI generates graphics, captions, and campaign copy
                        in seconds — trained on what works.
                    </p>

                    <button className="hero-btn">
                        Start for free
                    </button>

                </div>
                <div className="hero-right">
                    <Carousel autoplay={true}
          autoplayDelay={2200}
          pauseOnHover={true}
          />
                </div>
            </div>
        </div>
    );
}