import { Row, Col, Card } from "react-bootstrap";

function ImagesGrid({ images = [] }) {
    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-GB");
    };

    const getBadgeLabel = (type) => {
        if (type === "generate") return "Generated";
        if (type === "enhance") return "Enhanced";
        if (type === "theme") return "Themed";
        return "Image";
    };

    const getTitle = (item) => {
        if (item.details?.project_name) return item.details.project_name;
        if (item.details?.product_name) return item.details.product_name;
        if (item.details?.theme) return `${item.details.theme} style`;
        if (item.details?.style_type) return `${item.details.style_type} edit`;
        if (item.title) return item.title;
        return "Image result";
    };

    const getMainImage = (item) => {
        return (
            item.after_image ||
            item.generated_image ||
            item.image ||
            item.images?.[0] ||
            item.original_image ||
            ""
        );
    };

    const getBeforeImage = (item) => {
        if (item.type === "generate") return null;
        return item.original_image || item.before_image || null;
    };

    const getExtraImages = (item) => {
        const mainImage = getMainImage(item);
        const imagesList = Array.isArray(item.images) ? item.images : [];
        return imagesList.filter((img) => img && img !== mainImage);
    };

    const getDetails = (item) => {
        const rows = [];

        if (item.details?.project_name) rows.push(["Project", item.details.project_name]);
        if (item.details?.product_name) rows.push(["Product", item.details.product_name]);
        if (item.details?.theme) rows.push(["Theme", item.details.theme]);
        if (item.details?.style_type) rows.push(["Style", item.details.style_type]);

        if (item.type === "generate") {
            const prompt = item.details?.content || item.details?.prompt_used;
            if (prompt) rows.push(["Prompt", prompt]);
        }

        return rows;
    };

    const downloadImage = async (imageUrl, fileName = "pictory-image") => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${fileName}.jpg`;
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            window.open(imageUrl, "_blank");
        }
    };

    const ImageActions = ({ imageUrl, fileName }) => (
        <div className="studio-image-mini-actions">
            <button
                type="button"
                title="View image"
                onClick={() => window.open(imageUrl, "_blank")}
            >
                <i className="bi bi-eye"></i>
            </button>

            <button
                type="button"
                title="Download image"
                onClick={() => downloadImage(imageUrl, fileName)}
            >
                <i className="bi bi-download"></i>
            </button>
        </div>
    );

    const ImageBox = ({ imageUrl, alt, fileName, className = "" }) => (
        <div className={`studio-clickable-image ${className}`}>
            <img src={imageUrl} alt={alt} />
            <ImageActions imageUrl={imageUrl} fileName={fileName} />
        </div>
    );

    if (!images.length) {
        return (
            <div className="studio-empty-state text-center py-5">
                <i className="bi bi-images fs-1 mb-3 d-block"></i>
                <h5 className="hero-title">No images found</h5>
                <p className="text-secondary mb-0">Try a different search term.</p>
            </div>
        );
    }

    return (
        <Row className="g-4">
            {images.map((item, index) => {
                const mainImage = getMainImage(item);
                const beforeImage = getBeforeImage(item);
                const extraImages = getExtraImages(item);
                const details = getDetails(item);
                const title = getTitle(item);

                return (
                    <Col key={item.id || index} xl={4} lg={6} md={6}>
                        <Card className="studio-image-card border-0 shadow-sm h-100">
                            <div className="studio-image-wrap">
                                <img src={mainImage} alt={title} className="studio-image-preview" />

                                <div className="studio-image-topbar">
                  <span className="studio-image-badge">
                    {getBadgeLabel(item.type)}
                  </span>
                                </div>

                                <div className="studio-image-overlay">
                                    <button
                                        type="button"
                                        className="studio-icon-btn"
                                        title="View image"
                                        onClick={() => window.open(mainImage, "_blank")}
                                    >
                                        <i className="bi bi-eye"></i>
                                    </button>

                                    <button
                                        type="button"
                                        className="studio-icon-btn"
                                        title="Download image"
                                        onClick={() => downloadImage(mainImage, title)}
                                    >
                                        <i className="bi bi-download"></i>
                                    </button>
                                </div>
                            </div>

                            <Card.Body className="studio-image-body">
                                <div className="mb-3 text-center">
                                    <span className="studio-image-date">
                    {formatDate(item.created_at || item.date)}
                  </span>
                                </div>

                                {details.length > 0 && (
                                    <div className="studio-mini-details mb-3">
                                        {details.map(([label, value]) => (
                                            <div
                                                className={`studio-mini-detail ${
                                                    label === "Prompt" ? "studio-mini-detail-full" : ""
                                                }`}
                                                key={label}
                                            >
                                                <span>{label}</span>
                                                <strong>{value}</strong>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {beforeImage && (
                                    <div className="studio-before-after mb-3">
                                        <div>
                                            <span className="studio-section-label">Before</span>
                                            <ImageBox
                                                imageUrl={beforeImage}
                                                alt="Before"
                                                fileName={`${title}-before`}
                                            />
                                        </div>

                                        <div>
                                            <span className="studio-section-label">After</span>
                                            <ImageBox
                                                imageUrl={mainImage}
                                                alt="After"
                                                fileName={`${title}-after`}
                                            />
                                        </div>
                                    </div>
                                )}

                                {extraImages.length > 0 && (
                                    <div>
                                        <span className="studio-section-label">More results</span>
                                        <div className="studio-small-results">
                                            {extraImages.slice(0, 3).map((image, imgIndex) => (
                                                <ImageBox
                                                    key={`${image}-${imgIndex}`}
                                                    imageUrl={image}
                                                    alt={`Result ${imgIndex + 1}`}
                                                    fileName={`${title}-result-${imgIndex + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                );
            })}
        </Row>
    );
}

export default ImagesGrid;