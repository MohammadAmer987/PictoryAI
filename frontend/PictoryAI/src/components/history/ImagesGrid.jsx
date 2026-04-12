import { Row, Col, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';

function ImagesGrid({ images = [] }) {
    const handleDownload = async (imageUrl, title) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = `${title}.jpg`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    if (images.length === 0) {
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
            {images.map((item) => (
                <Col key={item.id} xl={3} lg={4} md={6}>
                    <Card className="studio-image-card border-0 shadow-sm h-100">
                        <div className="studio-image-wrap">
                            <Card.Img
                                variant="top"
                                src={item.image}
                                alt={item.title}
                                className="studio-image-preview"
                            />

                            <div className="studio-image-overlay">
                                <div className="studio-image-actions">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>Download</Tooltip>}
                                    >
                                        <button
                                            type="button"
                                            className="studio-icon-btn"
                                            onClick={() => handleDownload(item.image, item.title)}
                                        >
                                            <i className="bi bi-download"></i>
                                        </button>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>Delete</Tooltip>}
                                    >
                                        <button type="button" className="studio-icon-btn danger">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        </div>

                        <Card.Body className="studio-image-body">
                            <h5 className="studio-image-title mb-2">{item.title}</h5>

                            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                <span className="studio-image-badge">
                  {item.type || 'Theme'}
                </span>

                                <span className="studio-image-date">{item.date}</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}

export default ImagesGrid;