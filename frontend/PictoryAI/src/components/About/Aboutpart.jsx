import React from 'react';
import "../../css/AboutPart.css";
const features = [
  {
    title: "Who We Are ?",
    body: [
      "A team that believes every small business deserves professional marketing — without the high costs or complexity.",
    ],
  },
  {
    title: "What We Offer ?",
    body: [
      "AI-powered tools to enhance your product images, generate themed visuals, and create compelling captions — all in seconds.",
    ],
  },
  {
    title: "How We Help You Grow ?",
    body: [
      "No design skills needed. Just upload, customize, and let AI handle the rest — so you focus on growing your business.",
    ],
  },
];

function OrbitRing() {
  return (
    <div className="orbitWrap">
      <div className="orbitRing">
        <svg
          className="ringSvg"
          width="110"
          height="110"
          viewBox="0 0 110 110"
          fill="none"
        >
          <circle
            cx="55"
            cy="55"
            r="42"
            stroke="#afcab6"
            strokeWidth="0.5"
            strokeDasharray="3 3"
          />
          <circle cx="55" cy="55" r="26" stroke="#e8f4ec" strokeWidth="1" />
        </svg>
        <div className="orbitCenter">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2C10 2 14 6 14 10C14 14 10 18 10 18C10 18 6 14 6 10C6 6 10 2 10 2Z"
              fill="#afcab6"
            />
            <circle cx="10" cy="10" r="3" fill="#71967d" />
          </svg>
        </div>
        <div className="orbitDot" />
        <div className="orbitDot orbitDot2" />
      </div>
    </div>
  );
}

function AboutPart() {
  return (
     <section className="awtop">
    <section className="aw">
      

      <div className="hero">
        <div className="heroText">
          <h1 className="mainTitle">
            Why Choose<br />
             <em className="em">Pictory AI?</em>
          </h1>
          
        </div>
        <OrbitRing />
      </div>

      <div className="divider" />

      <div className="cards">
        {features.map((f, i) => (
          <div key={i} className="card" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
            
          <p className="cardTitle" style={{ fontSize: "17px" ,fontWeight:"bold" ,color:"#011005"}}>{f.title}</p>
            <div className="cardBody">
  {f.body.map((paragraph, i) => (
    <p key={i}>{paragraph}</p>
  ))}
</div>
          </div>
        ))}
      </div>

     
    
    </section>
    </section>
  );
}

export default AboutPart;