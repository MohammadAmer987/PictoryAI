import { useNavigate } from "react-router-dom";

const features = [
    { id: " ", label1: "Product", label2: "Image", sub: "Enhancement", route: "/tools/enhance-image" },
    { id: " ", label1: "Theme",   label2: "Image", sub: "Generator",   route: "/tools/theme-image-generator" },
    { id: " ", label1: "Custom",  label2: "Image", sub: "Generator",   route: "/tools/generate-image" },
    { id: " ", label1: "Custom",      label2: "Caption", sub: "Generator", route: "/tools/caption-generator" },
];

export default function Featurepart() {
    const navigate = useNavigate();

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=Space+Mono:wght@400;700&display=swap');

        .fs-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem 1rem;
       background :  #F4F8F6;

   
        }

        .fs-feat {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          padding: 18px 0;
          width: 100%;
          max-width: 600px;
          border-bottom: 5px solid #71967D;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
         
        }

        .fs-feat:first-child {
          // border-top: 5px solid #71967D;
        }

        .fs-feat:hover {
          transform: translateX(6px);
        }

        .fs-feat:hover .fs-num {
          opacity: 1;
        }

        .fs-feat:hover .fs-line {
          width: 40px;
          opacity: 1;
        }

        .fs-feat:hover .fs-main {
          letter-spacing: 0.12em;
        }

        .fs-feat:hover .fs-sub {
          letter-spacing: 0.28em;
        }

        .fs-feat:hover .fs-dot {
          opacity: 1;
        }

        .fs-num {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #71967D;
          opacity: 0.35;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          transition: opacity 0.3s;
          letter-spacing: 0.05em;
        }

        .fs-name-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .fs-main {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          font-size: clamp(30px, 6vw, 52px);
          color: #043F34;
          letter-spacing: 0.06em;
          line-height: 1;
          transition: letter-spacing 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .fs-italic {
          font-style: italic;
          font-weight: 300;
          color: #71967D;
        }

        .fs-sub {
          font-family: 'Space Mono', monospace;
          font-size: clamp(8px, 1.4vw, 11px);
          font-weight: 400;
          color: #71967D;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          line-height: 1;
          transition: letter-spacing 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .fs-line {
          display: block;
          height: 1px;
          background: linear-gradient(90deg, #B6E5D2, #71967D);
          width: 0px;
          opacity: 0;
          margin: 5px auto 0;
          transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s;
          border-radius: 5px;
        }

        .fs-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #B6E5D2;
          margin: 0 10px;
          flex-shrink: 0;
          opacity: 0;
          transition: opacity 0.3s;
        }
      `}</style>

            <div className="fs-wrap">
                {features.map((f) => (
                    <div
                        key={f.id}
                        className="fs-feat"
                        onClick={() => navigate(f.route)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && navigate(f.route)}
                    >
                        <span className="fs-num">{f.id}</span>

                        <div className="fs-name-block">
              <span className="fs-main">
                {f.label1 && <>{f.label1} </>}
                  <span className="fs-italic">{f.label2}</span>
              </span>
                            <span className="fs-sub">{f.sub}</span>
                            <span className="fs-line" />
                        </div>

                        <span className="fs-dot" />
                    </div>
                ))}

                <br/>
                <br/>
                <br/>
                <br/>


            </div>
        </>
    );
}