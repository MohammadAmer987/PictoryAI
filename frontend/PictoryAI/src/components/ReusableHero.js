import { Container, Row, Col, Badge, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HeroFeatureList from "./HeroFeatureList";

function Hero({
                  title,
                  description,
                  breadcrumb = [],
                  badgeText = "AI-POWERED TOOL",
                  features = []
              }) {
    return (
        <Container className="hero-bg mt-5 pt-4">

            {/* Breadcrumb */}
            <Breadcrumb className="small opacity-75 mb-3 custom-breadcrumb">
                {breadcrumb.map((item, index) => (
                    item.active ? (
                        <Breadcrumb.Item active key={index}>
                            {item.label}
                        </Breadcrumb.Item>
                    ) : (
                        <Breadcrumb.Item
                            key={index}
                            linkAs={Link}
                            linkProps={{ to: item.path }}
                            className="text-decoration-none text-muted"
                        >
                            {item.label}
                        </Breadcrumb.Item>
                    )
                ))}
            </Breadcrumb>

            <Row className="align-items-end g-4">
                <Col lg={8} md={12}>
                    <div className="hero-content">
                        <Badge className="hero-badge mb-3 px-3 py-2 rounded-pill d-inline-flex align-items-center border-0">
                            <i className="bi bi-stars me-2 small"></i>
                            {badgeText}
                        </Badge>

                        <h1 className="display-5 fw-bold mb-2 hero-title">
                            {title}
                        </h1>

                        <p className="hero-text fs-6 fw-semibold text-secondary mb-1" style={{ maxWidth: '650px' }}>
                            {description}
                        </p>
                    </div>
                </Col>

                <HeroFeatureList items={features} />
            </Row>
        </Container>
    );
}

export default Hero;