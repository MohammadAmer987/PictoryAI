import { Container, Row, Col, Badge } from 'react-bootstrap';
import '../App.css';
 import {Breadcrumb} from 'react-bootstrap';
 import {Link} from 'react-router-dom';
function Hero() {
  return (
    <Container className="hero-bg mt-5 pt-4">
     <Breadcrumb className="small opacity-75 mb-3 custom-breadcrumb">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }} className="text-decoration-none text-muted">
        Home
      </Breadcrumb.Item>

      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/tools" }}  className="text-decoration-none text-muted">
        AI Tools
      </Breadcrumb.Item>

      <Breadcrumb.Item active>
        Caption Generator
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
              AI Caption Generator
            </h1>

            <p className="hero-text fs-6 fw-semibold text-secondary mb-1" style={{ maxWidth: '650px' }}>
              Upload your product image, describe it briefly, and let AI craft 
              compelling marketing captions for your social media and ads.
            </p>
          </div>
        </Col>

       <Col lg={4} md={12} className="d-flex justify-content-lg-end justify-content-center align-items-end">
  <div className="d-flex gap-3 gap-sm-3 text-center justify-content-center w-100 align-items-end" style={{ maxWidth: '350px' }}>
    
    <div className="feature-item flex-grow-1">
      <div 
        className="shadow-sm rounded-4 mb-2 d-flex align-items-center justify-content-center icon-box-bg mx-auto"
        style={{ 
          aspectRatio: '1 / 1',
          width: '100%',
          maxWidth: '45px',   
          padding: '8%'
        }}
      >
        <i className="bi bi-image icon-color fs-6"></i> 
      </div>
      <small className="fw-semibold d-block hero-title text-nowrap extra-small-title">AI-Powered</small>
      <small className="extra-small text-secondary d-block text-nowrap">Image Analysis</small>
    </div>

    {/* Icon Item 2 */}
    <div className="feature-item flex-grow-1">
      <div 
        className="shadow-sm rounded-4 mb-2 d-flex align-items-center justify-content-center icon-box-bg mx-auto"
        style={{ 
          aspectRatio: '1 / 1',
          width: '100%',
          maxWidth: '45px',
          padding: '8%'
        }}
      >
        <i className="bi bi-translate icon-color fs-6"></i>
      </div>
      <small className="fw-semibold d-block hero-title text-nowrap extra-small-title">EN & AR</small>
      <small className="extra-small text-secondary d-block text-nowrap">Languages</small>
    </div>

    {/* Icon Item 3 */}
    <div className="feature-item flex-grow-1">
      <div 
        className="shadow-sm rounded-4 mb-2 d-flex align-items-center justify-content-center icon-box-bg mx-auto"
        style={{ 
          aspectRatio: '1 / 1',
          width: '100%',
          maxWidth: '45px',
          padding: '8%'
        }}
      >
        <i className="bi bi-layers icon-color fs-6"></i>
      </div>
      <small className="fw-semibold d-block hero-title text-nowrap extra-small-title">4 Types</small>
      <small className="extra-small text-secondary d-block text-nowrap">Caption Styles</small>
    </div>

  </div>
</Col>
      </Row>
    </Container>
  );
}

export default Hero;