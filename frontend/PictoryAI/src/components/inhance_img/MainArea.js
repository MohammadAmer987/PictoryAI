import { useState, useRef } from "react";
import "../../css/inhance_img/MainAreaStyle.css";

function MainArea({ isPro, isReady, settings }) {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedFileObj, setSelectedFileObj] = useState(null);
    const [results, setResults] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedResult, setSelectedResult] = useState(0);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // دالة التحميل
    const handleDownload = (imageUrl, index) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `generated-image-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        const url = URL.createObjectURL(file);
        setUploadedImage(url);
        setSelectedFileObj(file);
        setResults([]);
        setError(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleChange = (e) => handleFile(e.target.files[0]);

    const handleGenerate = async () => {
        if (!selectedFileObj || !isReady || !settings) return;

        setIsGenerating(true);
        setResults([]);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', selectedFileObj);

            const fieldMapping = {
                productName: 'product_name',
                audience: 'target_audience',
                productDescription: 'description',
                background: 'background',
                backgroundColor: 'background_color',
                backgroundBlur: 'background_blur',
                lightType: 'lighting',
                styleType: 'photo_style',
                textOnImage: 'text_on_image',
                textPosition: 'text_position',
                textColor: 'text_color',
                textSize: 'text_size',
                cameraAngle: 'camera_angle',
                imageRatio: 'aspect_ratio',
                extraPrompt: 'scene_details',
            };

            Object.entries(settings).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    const backendKey = fieldMapping[key] || key;
                    formData.append(backendKey, value);
                }
            });

            formData.append('num_images', isPro ? 3 : 1);

            const response = await fetch('http://localhost:8000/api/image-edit', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Generation failed');
            }

            setResults(data.edited_urls || []);
            setSelectedResult(0);
        } catch (err) {
            console.error("Full Backend Error:", err);
            let errorMsg = err.message;
            if (err.response?.data) {
                const data = err.response.data;
                errorMsg = data.fal_error?.message || data.fal_error || data.error || data.message || err.message;
            }
            setError(errorMsg);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="main-area">

            {/* Top row */}
            <div className="top-row">

                {/* Upload card */}
                <div className="upload-card">
                    <div className="card-label">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                        Product Image
                    </div>

                    <div className={`drop-zone ${isDragging ? "drag-over" : ""} ${uploadedImage ? "filled" : ""}`}
                         onClick={() => !uploadedImage && fileInputRef.current.click()}
                         onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                         onDragLeave={() => setIsDragging(false)}
                         onDrop={handleDrop}>

                        {uploadedImage ? (
                            <>
                                <img src={uploadedImage} alt="product" className="preview-img" />
                                <div className="preview-overlay">
                                    <button className="change-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        Change
                                    </button>
                                    <button className="remove-img-btn" onClick={(e) => { e.stopPropagation(); setUploadedImage(null); setResults([]); setSelectedFileObj(null); }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                                        Remove
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="empty-drop">
                                <div className="drop-icon-wrap">
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="17 8 12 3 7 8"/>
                                        <line x1="12" y1="3" x2="12" y2="15"/>
                                    </svg>
                                </div>
                                <p className="drop-title">Drop image here</p>
                                <p className="drop-sub">or <span onClick={() => fileInputRef.current.click()}>browse</span> · PNG JPG WEBP</p>
                            </div>
                        )}
                    </div>

                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleChange} />
                </div>

                <div className="flow-arrow">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 12h14M13 6l6 6-6 6"/>
                    </svg>
                </div>

                {/* Generate card */}
                <div className="generate-card">
                    <div className="card-label">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        Generate
                    </div>

                    <div className="gen-content">
                        <div className="gen-info">
                            <div className="gen-stat">
                                <span className="stat-num">{isPro ? 3 : 1}</span>
                                <span className="stat-label">image{isPro ? "s" : ""}</span>
                            </div>
                            <div className="gen-divider"></div>
                            <div className="gen-stat">
                                <span className="stat-num">{isPro ? "HD" : "SD"}</span>
                                <span className="stat-label">quality</span>
                            </div>
                        </div>

                        {!isPro && (
                            <div className="free-notice">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Free plan · 1 result
                            </div>
                        )}
                        {isPro && (
                            <div className="free-notice">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Pro plan · 3 results
                            </div>
                        )}
                    </div>

                    {uploadedImage && !isReady && (
                        <p style={{ fontSize: "14px", color: "#c53030", textAlign: "center", margin: "12px 0", padding: "10px", backgroundColor: "#fff5f5", border: "1px solid #feb2b2", borderRadius: "8px", fontWeight: "500" }}>
                            Please complete all settings before generating.
                        </p>
                    )}

                    {error && (
                        <p style={{ fontSize: "14px", color: "#c53030", textAlign: "center", margin: "12px 0", padding: "10px", backgroundColor: "#fff5f5", border: "1px solid #feb2b2", borderRadius: "8px", fontWeight: "500" }}>
                            ⚠️ {error}
                        </p>
                    )}

                    <button
                        className={`gen-btn ${(!selectedFileObj || !isReady) ? "disabled" : ""} ${isGenerating ? "loading" : ""}`}
                        onClick={handleGenerate}
                        disabled={!selectedFileObj || !isReady || isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <span className="spinner"></span>
                                Generating…
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                Generate {isPro ? "3 Images" : "Image"}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Results Area */}
            {results.length > 0 && (
                <div className="results-area">
                    <div className="results-label">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg>
                        Generated Result{results.length > 1 ? "s" : ""}
                        {isPro && <span className="pro-chip">PRO · {results.length} image{results.length !== 1 ? "s" : ""}</span>}
                    </div>

                    {isPro ? (
                        <div className="pro-results">
                            <div className="featured-result">
                                <img src={results[selectedResult]} alt="Featured result" />
                                <div className="featured-actions">
                                    <button className="action-btn primary" onClick={() => handleDownload(results[selectedResult], selectedResult)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="7 10 12 15 17 10"/>
                                            <line x1="12" y1="15" x2="12" y2="3"/>
                                        </svg>
                                        Download HD
                                    </button>
                                </div>
                                <div className="result-num">0{selectedResult + 1}</div>
                            </div>

                            <div className="thumbs-strip">
                                {results.map((src, i) => (
                                    <div key={i} className={`thumb ${selectedResult === i ? "active" : ""}`} onClick={() => setSelectedResult(i)}>
                                        <img src={src} alt={`Result ${i + 1}`} />
                                        <span className="thumb-num">0{i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="free-result">
                            <div className="free-result-img-wrap">
                                <img src={results[0]} alt="Generated result" />
                                <button className="dl-btn" onClick={() => handleDownload(results[0], 0)}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="7 10 12 15 17 10"/>
                                        <line x1="12" y1="15" x2="12" y2="3"/>
                                    </svg>
                                    Download
                                </button>
                            </div>

                            <div className="upsell-strip">
                                <div className="upsell-left">
                                    <p className="upsell-title">Want more results?</p>
                                    <p className="upsell-sub">Upgrade to Pro — get 3 images per generation, advanced controls & unlimited runs.</p>
                                </div>
                                <button className="upsell-btn">✦ Go Pro</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Idle state */}
            {!uploadedImage && results.length === 0 && !isGenerating && (
                <div className="idle-state">
                    <div className="idle-visual">
                        <div className="idle-ring r1"></div>
                        <div className="idle-ring r2"></div>
                        <div className="idle-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/>
                                <circle cx="12" cy="13" r="3"/>
                            </svg>
                        </div>
                    </div>
                    <p className="idle-title">Ready when you are</p>
                    <p className="idle-sub">Configure settings on the left, upload your product image, and generate stunning visuals in seconds.</p>
                </div>
            )}

        </div>
    );
}

export default MainArea;