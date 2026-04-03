import { useState, useRef } from "react";

const C = {
  darkGreen:  "#043F34",
  midGreen:   "#71967D",
  softGreen:  "#AFCAB8",
  mintGreen:  "#B6E5D2",
};

const PALETTE = [C.darkGreen, C.midGreen, C.softGreen, C.mintGreen];

const IMAGE_TYPES = [
  { id: "post",   label: "Post",   ratio: "1 : 1",  w: 1,  h: 1  },
  { id: "story",  label: "Story",  ratio: "9 : 16", w: 9,  h: 16 },
  { id: "banner", label: "Banner", ratio: "16 : 9", w: 16, h: 9  },
];

const Card = ({ children, style = {} }) => (
    <div style={{
      background: "#fff",
      border: `1.5px solid ${C.mintGreen}`,
      borderRadius: 18,
      padding: "24px 28px",
      boxShadow: `0 4px 24px rgba(4,63,52,0.07)`,
      ...style
    }}>
      {children}
    </div>
);

const FieldLabel = ({ children, pro }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: C.darkGreen, textTransform: "uppercase" }}>
      {children}
    </span>
      {pro && (
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            background: C.darkGreen, color: C.mintGreen,
            borderRadius: 4, padding: "2px 7px",
          }}>PRO</span>
      )}
    </div>
);

const Field = (props) => (
    <input {...props} style={{
      width: "100%", background: "#f7faf9",
      border: `1.5px solid ${C.softGreen}`,
      borderRadius: 10, padding: "12px 15px",
      color: C.darkGreen, fontSize: 14, outline: "none",
      fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.02em",
      transition: "border-color 0.2s, box-shadow 0.2s", boxSizing: "border-box",
      ...props.style
    }}
           onFocus={e => { e.target.style.borderColor = C.darkGreen; e.target.style.boxShadow = `0 0 0 3px ${C.mintGreen}`; }}
           onBlur={e => { e.target.style.borderColor = C.softGreen; e.target.style.boxShadow = "none"; }}
    />
);

const Preview = ({ businessName, overlayText, colors, imageType, logoUrl }) => {
  const type = IMAGE_TYPES.find(t => t.id === imageType) || IMAGE_TYPES[0];
  const pw = 300, ph = Math.round(pw * type.h / type.w);
  const c1 = colors[0] || C.darkGreen;
  const c2 = colors[1] || C.midGreen;
  const c3 = colors[2] || C.softGreen;
  const c4 = colors[3] || C.mintGreen;

  return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{
          width: pw, height: ph, borderRadius: 14, position: "relative", overflow: "hidden",
          background: `linear-gradient(145deg, ${c1} 0%, ${c2} 55%, ${c3} 80%, ${c4} 100%)`,
          boxShadow: `0 12px 48px rgba(4,63,52,0.22)`,
          border: `2px solid ${C.mintGreen}`,
          flexShrink: 0,
        }}>
          <div style={{ position:"absolute", width:180, height:180, borderRadius:"50%", background:`radial-gradient(circle, ${c4}55 0%, transparent 65%)`, top:-50, right:-50, pointerEvents:"none" }} />
          <div style={{ position:"absolute", width:120, height:120, borderRadius:"50%", background:`radial-gradient(circle, ${c3}44 0%, transparent 65%)`, bottom:-30, left:-30, pointerEvents:"none" }} />
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.06, pointerEvents:"none" }}>
            {Array.from({length:9}).map((_,i)=><line key={`v${i}`} x1={i*38} y1={0} x2={i*38} y2={ph} stroke="#fff" strokeWidth={0.6}/>)}
            {Array.from({length:12}).map((_,i)=><line key={`h${i}`} x1={0} y1={i*38} x2={pw} y2={i*38} stroke="#fff" strokeWidth={0.6}/>)}
          </svg>
          {logoUrl && (
              <div style={{ position:"absolute", top:14, left:14 }}>
                <img src={logoUrl} alt="logo" style={{ width:40, height:40, objectFit:"contain", borderRadius:8, background:"rgba(255,255,255,0.2)", padding:5 }}/>
              </div>
          )}
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:28, textAlign:"center" }}>
            {businessName
                ? <div style={{ fontSize: type.id==="story"?20:24, fontWeight:700, color:"#fff", fontFamily:"'Cormorant Garamond',serif", letterSpacing:"0.04em", lineHeight:1.2, marginBottom:10, textShadow:"0 2px 16px rgba(0,0,0,0.3)" }}>{businessName}</div>
                : <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic" }}>Your business name</div>
            }
            {overlayText && (
                <>
                  <div style={{ width:32, height:1.5, background:"rgba(255,255,255,0.6)", margin:"0 auto 10px" }}/>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.92)", letterSpacing:"0.12em", textTransform:"uppercase" }}>{overlayText}</div>
                </>
            )}
          </div>
          <div style={{ position:"absolute", bottom:10, right:14, fontSize:8, color:"rgba(255,255,255,0.3)", letterSpacing:"0.14em", textTransform:"uppercase" }}>{type.ratio.replace(/ /g,"")}</div>
        </div>
        <div style={{ fontSize:10, color:C.midGreen, letterSpacing:"0.14em", textTransform:"uppercase", fontWeight:600 }}>
          {type.label} · {type.ratio}
        </div>
      </div>
  );
};

export default function ImageGenerator() {
  const [businessName, setBusinessName] = useState("");
  const [overlayText, setOverlayText]   = useState("");
  const [colors, setColors]             = useState([...PALETTE]);
  const [imageType, setImageType]       = useState("post");
  const [logoUrl, setLogoUrl]           = useState(null);
  const [vision, setVision]             = useState("");
  const fileRef = useRef();

  const updateColor = (i, val) => { const n=[...colors]; n[i]=val; setColors(n); };

  return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg, #f0faf6 0%, #e8f5ef 50%, #f5fcf8 100%)", fontFamily:"sans-serif", color:C.darkGreen }}>

        <div style={{ height:4, background:`linear-gradient(90deg, ${C.darkGreen}, ${C.midGreen}, ${C.softGreen}, ${C.mintGreen})` }}/>

        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300&display=swap" rel="stylesheet"/>

        <div style={{ maxWidth:1080, margin:"0 auto", padding:"44px 24px 80px" }}>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:16, background:C.mintGreen, borderRadius:20, padding:"5px 16px" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:C.darkGreen }}/>
              <span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.18em", color:C.darkGreen, textTransform:"uppercase" }}>Pictory AI</span>
            </div>
            <h1 style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:"clamp(40px,6vw,68px)", fontWeight:600, letterSpacing:"-0.01em",
              color:C.darkGreen, margin:"0 0 12px", lineHeight:1.1,
            }}>
              Image Generator
            </h1>
            <p style={{ fontSize:15, color:C.midGreen, letterSpacing:"0.03em", margin:0, fontWeight:400 }}>

            </p>
          </div>

          {/* Grid layout */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:24, alignItems:"start" }}>

            {/* LEFT */}
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

              <Card>
                <FieldLabel > Business Name <span style={{color:C.midGreen }}>*</span></FieldLabel>
                <Field placeholder="e.g. Coffee House, Fashion Store…" value={businessName} onChange={e=>setBusinessName(e.target.value)}/>
              </Card>

              <Card>
                <FieldLabel>Promotional Text</FieldLabel>
                <Field placeholder="e.g. Best Coffee in Town, 20% Discount…" value={overlayText} onChange={e=>setOverlayText(e.target.value)}/>
              </Card>

              <Card>
                <FieldLabel>Image Format <span style={{ color:C.midGreen }}>*</span></FieldLabel>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginTop:4 }}>
                  {IMAGE_TYPES.map(t => {
                    const active = imageType === t.id;
                    return (
                        <button key={t.id} onClick={()=>setImageType(t.id)} style={{
                          padding:"16px 8px", borderRadius:12, cursor:"pointer", transition:"all 0.18s",
                          border: active ? `2px solid ${C.darkGreen}` : `1.5px solid ${C.softGreen}`,
                          background: active ? C.darkGreen : "#f7faf9",
                          color: active ? C.mintGreen : C.midGreen,
                          display:"flex", flexDirection:"column", alignItems:"center", gap:5,
                        }}>
                          <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase" }}>{t.label}</span>
                          <span style={{ fontSize:10, opacity:0.7, letterSpacing:"0.05em" }}>{t.ratio}</span>
                        </button>
                    );
                  })}
                </div>
              </Card>

              <Card>
                <FieldLabel>Design Colors</FieldLabel>
                <div style={{ display:"flex", gap:14, flexWrap:"wrap", alignItems:"center" }}>
                  {colors.map((c, i) => (
                      <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:7 }}>
                        <label style={{ position:"relative", cursor:"pointer", display:"block" }}>
                          <div style={{
                            width:52, height:52, borderRadius:14, background:c,
                            border:`2px solid ${C.softGreen}`,
                            boxShadow:`0 4px 16px ${c}55`,
                            transition:"transform 0.15s, box-shadow 0.15s",
                          }}
                               onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.09)"; e.currentTarget.style.boxShadow=`0 6px 22px ${c}88`; }}
                               onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow=`0 4px 16px ${c}55`; }}
                          />
                          <input type="color" value={c} onChange={e=>updateColor(i,e.target.value)}
                                 style={{ position:"absolute", inset:0, opacity:0, width:"100%", height:"100%", cursor:"pointer" }}/>
                        </label>
                        <span style={{ fontSize:8, color:C.midGreen, letterSpacing:"0.04em", fontWeight:600 }}>{c.toUpperCase()}</span>
                      </div>
                  ))}
                  <button onClick={()=>setColors([...PALETTE])} style={{
                    fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:600,
                    color:C.darkGreen, background:"transparent",
                    border:`1.5px solid ${C.softGreen}`, borderRadius:8,
                    padding:"7px 14px", cursor:"pointer", marginLeft:"auto",
                    transition:"background 0.15s, border-color 0.15s",
                  }}
                          onMouseEnter={e=>{ e.currentTarget.style.background=C.mintGreen; e.currentTarget.style.borderColor=C.midGreen; }}
                          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=C.softGreen; }}
                  >
                    Reset
                  </button>
                </div>
              </Card>

              {/* PRO panel */}
              <div style={{
                background:`linear-gradient(135deg, ${C.mintGreen}44 0%, #fff 55%, ${C.softGreen}22 100%)`,
                border:`1.5px solid ${C.softGreen}`,
                borderRadius:18, padding:"26px 28px", position:"relative", overflow:"hidden",
                boxShadow:`0 4px 24px rgba(4,63,52,0.07)`,
              }}>
                <div style={{ position:"absolute", top:-30, right:-30, width:130, height:130, borderRadius:"50%", background:`radial-gradient(circle, ${C.mintGreen}55 0%, transparent 70%)`, pointerEvents:"none" }}/>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
                  <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", color:C.darkGreen, textTransform:"uppercase" }}>Pro Features</span>
                  <div style={{ flex:1, height:1.5, background:`linear-gradient(90deg, ${C.softGreen}, transparent)` }}/>
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:C.darkGreen, color:C.mintGreen, borderRadius:4, padding:"2px 8px" }}>Unlocked</span>
                </div>

                <div style={{ marginBottom:20 }}>
                  <FieldLabel pro>Logo Upload</FieldLabel>
                  <div onClick={()=>fileRef.current.click()} style={{
                    border:`1.5px dashed ${C.softGreen}`, borderRadius:12,
                    padding:"18px 20px", cursor:"pointer", background:"rgba(255,255,255,0.75)",
                    display:"flex", alignItems:"center", gap:14, transition:"all 0.2s",
                  }}
                       onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.darkGreen; e.currentTarget.style.background=`${C.mintGreen}44`; }}
                       onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.softGreen; e.currentTarget.style.background="rgba(255,255,255,0.75)"; }}
                  >
                    {logoUrl
                        ? <>
                          <img src={logoUrl} alt="logo" style={{ width:44, height:44, objectFit:"contain", borderRadius:8, border:`1.5px solid ${C.softGreen}` }}/>
                          <div>
                            <div style={{ fontSize:13, color:C.darkGreen, fontWeight:600, marginBottom:2 }}>Logo uploaded</div>
                            <div style={{ fontSize:11, color:C.midGreen }}>Click to change</div>
                          </div>
                        </>
                        : <>
                          <div style={{ width:44, height:44, borderRadius:10, border:`1.5px dashed ${C.softGreen}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:C.midGreen, background:"#f7faf9" }}>+</div>
                          <div>
                            <div style={{ fontSize:13, color:C.darkGreen, fontWeight:500, marginBottom:2 }}>Upload your logo</div>
                            <div style={{ fontSize:11, color:C.midGreen }}>PNG, SVG, JPG supported</div>
                          </div>
                        </>
                    }
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }}
                         onChange={e=>{ const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onload=ev=>setLogoUrl(ev.target.result); r.readAsDataURL(f); }}}/>
                </div>

                <div>
                  <FieldLabel pro>Describe Your Vision</FieldLabel>
                  <textarea placeholder="e.g. A modern coffee shop promotion with elegant typography…"
                            value={vision} onChange={e=>setVision(e.target.value)} rows={3}
                            style={{
                              width:"100%", background:"rgba(255,255,255,0.85)",
                              border:`1.5px solid ${C.softGreen}`,
                              borderRadius:10, padding:"12px 15px",
                              color:C.darkGreen, fontSize:14, outline:"none",
                              fontFamily:"'Cormorant Garamond', serif", letterSpacing:"0.02em",
                              resize:"vertical", transition:"border-color 0.2s, box-shadow 0.2s",
                              boxSizing:"border-box", lineHeight:1.6,
                            }}
                            onFocus={e=>{ e.target.style.borderColor=C.darkGreen; e.target.style.boxShadow=`0 0 0 3px ${C.mintGreen}`; }}
                            onBlur={e=>{ e.target.style.borderColor=C.softGreen; e.target.style.boxShadow="none"; }}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ position:"sticky", top:24 }}>
              <Card style={{ marginBottom:14 }}>
                <div style={{ fontSize:9, letterSpacing:"0.18em", color:C.midGreen, textTransform:"uppercase", fontWeight:700, marginBottom:18, textAlign:"center" }}>Live Preview</div>
                <Preview businessName={businessName} overlayText={overlayText} colors={colors} imageType={imageType} logoUrl={logoUrl}/>
              </Card>

              <button style={{
                width:"100%", padding:"17px", borderRadius:14,
                background:`linear-gradient(135deg, ${C.darkGreen} 0%, ${C.midGreen} 100%)`,
                border:`1.5px solid ${C.darkGreen}`,
                color:"#fff", fontSize:13, fontWeight:700,
                letterSpacing:"0.1em", textTransform:"uppercase",
                cursor: businessName ? "pointer" : "not-allowed",
                opacity: businessName ? 1 : 0.45,
                transition:"all 0.2s",
                boxShadow:`0 6px 28px rgba(4,63,52,0.25)`,
              }}
                      onMouseEnter={e=>{ if(businessName){ e.target.style.transform="translateY(-1px)"; e.target.style.boxShadow=`0 10px 36px rgba(4,63,52,0.38)`; }}}
                      onMouseLeave={e=>{ e.target.style.transform="translateY(0)"; e.target.style.boxShadow=`0 6px 28px rgba(4,63,52,0.25)`; }}
              >
                Generate Image
              </button>

              <p style={{ textAlign:"center", fontSize:11, color:C.softGreen, marginTop:10, letterSpacing:"0.05em", fontWeight:600 }}>
                {!businessName ? "Enter a business name to continue" : "Ready to generate"}
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}




