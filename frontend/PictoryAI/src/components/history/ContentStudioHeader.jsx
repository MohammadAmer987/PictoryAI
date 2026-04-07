import { Container, Row, Col, Badge, Breadcrumb, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ContentStudioHeader({
                               searchTerm = '',
                               onSearchChange,
                               sortValue = 'newest',
                               onSortChange,
                               totalImages = 0,
                               totalCaptions = 0,
                             }) {
  return (
      <Container className="mt-5">
        <Container className="hero-bg pt-4 content-studio-hero">
          <Breadcrumb className="small opacity-75 mb-3 custom-breadcrumb">
            <Breadcrumb.Item
                linkAs={Link}
                linkProps={{ to: "/" }}
                className="text-decoration-none text-muted"
            >
              Home
            </Breadcrumb.Item>

            <Breadcrumb.Item
                linkAs={Link}
                linkProps={{ to: "/tools" }}
                className="text-decoration-none text-muted"
            >
              AI Tools
            </Breadcrumb.Item>

            <Breadcrumb.Item active>
              Content Studio
            </Breadcrumb.Item>
          </Breadcrumb>

          <Row className="align-items-end g-4">
            <Col lg={8} md={12}>
              <div className="hero-content">
                <Badge className="hero-badge mb-3 px-3 py-2 rounded-pill d-inline-flex align-items-center border-0">
                  <i className="bi bi-stars me-2 small"></i>
                  AI-POWERED TOOL
                </Badge>

                <h1 className="display-5 fw-bold mb-2 hero-title">
                  Content Studio
                </h1>

                <p
                    className="hero-text fs-6 fw-semibold text-secondary mb-1"
                    style={{ maxWidth: '650px' }}
                >
                  Access all your saved generated images and captions in one place.
                  Search, manage, and reuse your content anytime with ease.
                </p>
              </div>
            </Col>

            <Col
                lg={4}
                md={12}
                className="d-flex justify-content-lg-end justify-content-center align-items-end"
            >
              <div
                  className="d-flex gap-3 text-center justify-content-center w-100 align-items-end"
                  style={{ maxWidth: '350px' }}
              >
                <div className="feature-item flex-grow-1">
                  <div
                      className="shadow-sm rounded-4 mb-2 d-flex align-items-center justify-content-center icon-box-bg mx-auto"
                      style={{
                        aspectRatio: '1 / 1',
                        width: '100%',
                        maxWidth: '45px',
                        padding: '8%',
                      }}
                  >
                    <i className="bi bi-images icon-color fs-6"></i>
                  </div>
                  <small className="fw-semibold d-block hero-title text-nowrap extra-small-title">
                    Saved
                  </small>
                  <small className="extra-small text-secondary d-block text-nowrap">
                    Images
                  </small>
                </div>

                <div className="feature-item flex-grow-1">
                  <div
                      className="shadow-sm rounded-4 mb-2 d-flex align-items-center justify-content-center icon-box-bg mx-auto"
                      style={{
                        aspectRatio: '1 / 1',
                        width: '100%',
                        maxWidth: '45px',
                        padding: '8%',
                      }}
                  >
                    <i className="bi bi-card-text icon-color fs-6"></i>
                  </div>
                  <small className="fw-semibold d-block hero-title text-nowrap extra-small-title">
                    Ready
                  </small>
                  <small className="extra-small text-secondary d-block text-nowrap">
                    Captions
                  </small>
                </div>

                <div className="feature-item flex-grow-1">
                  <div
                      className="shadow-sm rounded-4 mb-2 d-flex align-items-center justify-content-center icon-box-bg mx-auto"
                      style={{
                        aspectRatio: '1 / 1',
                        width: '100%',
                        maxWidth: '45px',
                        padding: '8%',
                      }}
                  >
                    <i className="bi bi-clock-history icon-color fs-6"></i>
                  </div>
                  <small className="fw-semibold d-block hero-title text-nowrap extra-small-title">
                    Easy
                  </small>
                  <small className="extra-small text-secondary d-block text-nowrap">
                    History
                  </small>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="g-3 mt-4">
            <Col lg={8} md={12}>
              <div className="studio-search-wrap">
                <i className="bi bi-search studio-search-icon"></i>
                <Form.Control
                    type="text"
                    placeholder="Search by name, caption, or keyword..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="studio-search-input"
                />
              </div>
            </Col>

            <Col lg={4} md={12}>
              <div className="studio-select-wrap">
                <i className="bi bi-funnel studio-select-icon"></i>

                <Form.Select
                    value={sortValue}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="studio-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="az">A to Z</option>
                  <option value="za">Z to A</option>
                </Form.Select>
              </div>
            </Col>
          </Row>

          <Row className="g-3 mt-2 pb-2">
            <Col md={6}>
              <div className="studio-stat-card">
                <div className="d-flex align-items-center gap-3">
                  <div className="studio-stat-icon">
                    <i className="bi bi-image"></i>
                  </div>

                  <div>
                    <h5 className="mb-1 fw-bold hero-title">{totalImages}</h5>
                    <p className="mb-0 text-secondary extra-small">
                      Total Images
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="studio-stat-card">
                <div className="d-flex align-items-center gap-3">
                  <div className="studio-stat-icon">
                    <i className="bi bi-chat-quote"></i>
                  </div>

                  <div>
                    <h5 className="mb-1 fw-bold hero-title">{totalCaptions}</h5>
                    <p className="mb-0 text-secondary extra-small">
                      Total Captions
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
  );
}

export default ContentStudioHeader;