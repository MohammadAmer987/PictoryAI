import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Hero from "../components/ReusableHero";

import RatioCard from "../components/inhance_img/RatioCard";
import "../css/theme_img/ThemeImgPage.css";
import {
    TreePine,
    Moon,
    ShoppingBag,
    Heart,
    GraduationCap,
    Sun,
    Flower,
    BookOpen
} from "lucide-react";

function ThemeImagePage() {
    const [theme, setTheme] = useState("");
    const [imageSize, setImageSize] = useState("");
    const [optionalText, setOptionalText] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedPreview, setUploadedPreview] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const themes = [
        "Eid al-Fitr",
        "Eid al-Adha",
        "Christmas",
        "Black Friday",
        "Valentine's Day",
        "Graduation",
        "New Year",
        "Mother's Day",
        "Back to School",
        "Ramadan",
    ];

    const isFormValid = theme && imageSize && uploadedFile;

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadedFile(file);
        setUploadedPreview(URL.createObjectURL(file));
    };

    const handleGenerate = async (e) => {
        e.preventDefault();

        if (!theme || !imageSize || !uploadedFile) {
            return;
        }

        setIsGenerating(true);

        try {
            setTimeout(() => {
                if (uploadedPreview) {
                    setGeneratedImage(uploadedPreview);
                }
                setIsGenerating(false);
            }, 1200);
        } catch (error) {
            console.error("Generate failed:", error);
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (!generatedImage) return;

        const link = document.createElement("a");
        link.href = generatedImage;
        link.download = "generated-image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="theme-image-page">
            <Hero
                title="Theme Image Generator"
                description="Create ready-made visuals instantly using elegant seasonal themes, preferred image sizes, and optional custom text."
                breadcrumb={[
                    { label: "Home", path: "/" },
                    { label: "Tools", path: "/tools" },
                    { label: "Theme Image Generator", active: true },
                ]}
                features={[
                    {
                        icon: "bi-image",
                        title: "Ready Themes",
                        subtitle: "Seasonal Styles",
                    },
                    {
                        icon: "bi-aspect-ratio",
                        title: "Flexible Sizes",
                        subtitle: "Perfect Ratios",
                    },
                    {
                        icon: "bi-stars",
                        title: "AI Generation",
                        subtitle: "Instant Output",
                    },
                ]}
            />

            <section className="theme-generator-section">
                <Container>
                    <Row className="g-4 align-items-start">
                        <Col lg={5}>
                            <div className="theme-form-box">
                                <p className="panel-title">Configuration</p>

                                <Form onSubmit={handleGenerate}>
                                    <Form.Group className="mb-3">
                                        <label className="theme-label">Theme</label>
                                        <div className="theme-buttons-grid">
                                            {themes.map((item) => (
                                                <button
                                                    type="button"
                                                    key={item}
                                                    className={`theme-btn ${theme === item ? "active" : ""}`}
                                                    onClick={() => setTheme(item)}
                                                >
                                                    <span className="theme-btn-icon">{themeIcon(item)}</span>
                                                    <span className="theme-btn-label">{item}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <label className="theme-label">Upload image</label>
                                        <div className="upload-box">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="upload-input"
                                            />

                                            {uploadedPreview ? (
                                                <div className="upload-preview-wrap">
                                                    <img
                                                        src={uploadedPreview}
                                                        alt="Uploaded preview"
                                                        className="upload-preview-image"
                                                    />
                                                    <div className="upload-preview-info">
                                                        <span className="upload-file-name">
                                                            {uploadedFile?.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="upload-placeholder">
                                                    <div className="upload-icon-circle">
                                                        <i className="bi bi-cloud-arrow-up"></i>
                                                    </div>
                                                    <p>Click to upload your image</p>
                                                    <small>PNG, JPG, JPEG</small>
                                                </div>
                                            )}
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <label className="theme-label">Image size</label>
                                        <div className="ratio-cards-grid">
                                            {[
                                                { value: "1:1", label: "Square" },
                                                { value: "16:9", label: "Landscape" },
                                                { value: "4:5", label: "Instagram" },
                                                { value: "9:16", label: "Story" },
                                                { value: "3:4", label: "Portrait" },
                                            ].map(({ value, label }) => (
                                                <RatioCard
                                                    key={value}
                                                    ratio={value}
                                                    label={label}
                                                    selected={imageSize === value}
                                                    onClick={() => setImageSize(value)}
                                                />
                                            ))}
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <label className="theme-label">Optional text</label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            className="theme-input theme-textarea"
                                            placeholder="Write any text you want to appear in the image..."
                                            value={optionalText}
                                            onChange={(e) => setOptionalText(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        className="theme-generate-btn"
                                        disabled={isGenerating || !isFormValid}
                                    >
                                        {isGenerating ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-stars"></i>
                                                Generate image
                                            </>
                                        )}
                                    </Button>
                                </Form>
                            </div>
                        </Col>

                        <Col lg={7}>
                            <div className="theme-result-box">
                                <p className="panel-title">Result preview</p>

                                <div className={`result-frame ${getRatioClass(imageSize || "1:1")}`}>
                                    {generatedImage ? (
                                        <div className="result-image-wrapper">
                                            <img
                                                src={generatedImage}
                                                alt="Generated result"
                                                className="result-image"
                                            />

                                            <button
                                                className="download-btn"
                                                onClick={handleDownload}
                                            >
                                                Download
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="result-placeholder">
                                            <div className="empty-icon-circle">
                                                <i className="bi bi-image"></i>
                                            </div>
                                            <h5>No image generated yet</h5>
                                            <p>
                                                Upload an image, choose your theme and size,
                                                then click Generate image.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
}

function themeIcon(theme) {
    const icons = {
        "Eid al-Fitr": (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 3a9 9 0 1 0 6 15 7 7 0 1 1-6-15Z" />
                <path d="M18 7l0.6 1.8L20.5 9l-1.5 1.2L19.5 12 18 11l-1.5 1 0.5-1.8L15.5 9l1.9-0.2L18 7Z" />
            </svg>
        ),
        "Eid al-Adha": (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="6" width="14" height="12" rx="1.5" />
                <line x1="5" y1="6" x2="19" y2="6" />
                <line x1="5" y1="10" x2="19" y2="10" />
            </svg>
        ),
        "Christmas": <TreePine size={22} />,
        "Black Friday": <ShoppingBag size={22} />,
        "Valentine's Day": <Heart size={22} />,
        "Graduation": <GraduationCap size={22} />,
        "New Year": <Sun size={22} />,
        "Mother's Day": <Flower size={22} />,
        "Back to School": <BookOpen size={22} />,
        "Ramadan": <Moon size={22} />,
    };

    return icons[theme] || null;
}

function getRatioClass(ratio) {
    switch (ratio) {
        case "16:9":
            return "frame-16-9";
        case "9:16":
            return "frame-9-16";
        case "4:5":
            return "frame-4-5";
        case "3:4":
            return "frame-3-4";
        case "1:1":
        default:
            return "frame-1-1";
    }
}

export default ThemeImagePage;