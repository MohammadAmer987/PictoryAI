import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../images/logo4.png';

function Footer() {
    return (
        <footer className="footer-section py-5 mt-5">
            <Container>
                <Row className="gy-5 align-items-start mb-5">
                    <Col xs={12} lg={4} className="text-center text-lg-start">
                        <div className="footer-brand mb-4">
                            <div className="footer-logo-row mb-3">
                                <img src={logo} alt="Pictory Logo" className="footer-logo" />
                                <h4 className="footer-brand-text">Pictory AI</h4>
                            </div>
                            <p className="footer-tagline mb-4 text-center text-lg-start">
                                AI-powered marketing for everyone
                            </p>
                        </div>

                    </Col>

                    <Col xs={6} md={4} lg={2} className="text-center text-md-start">
                        <h6 className="footer-heading mb-3">Explore</h6>
                        <ul className="list-unstyled footer-list mb-0">
                            <li><Link to="/about" className="footer-link">About Us</Link></li>
                            <li><Link to="/features" className="footer-link">Features</Link></li>
                            <li><Link to="/pricing" className="footer-link">Pricing</Link></li>
                        </ul>
                    </Col>

                    <Col xs={6} md={4} lg={2} className="text-center text-md-start">
                        <h6 className="footer-heading mb-3">Tools</h6>
                        <ul className="list-unstyled footer-list mb-0">
                            <li><Link to="/tools" className="footer-link">All Tools</Link></li>
                            <li><Link to="/tools/caption-generator" className="footer-link">Caption Generator</Link></li>
                            <li><Link to="/tools/enhance-image" className="footer-link">Enhance Image</Link></li>
                            <li><Link to="/tools/theme-image-generation" className="footer-link">Theme Images</Link></li>
                        </ul>
                    </Col>

                    <Col xs={12} md={4} lg={2} className="text-center text-md-start">
                        <h6 className="footer-heading mb-3">Plans</h6>
                        <ul className="list-unstyled footer-list mb-0">
                            <li><Link to="/subscription" className="footer-link">My Plan</Link></li>
                            <li><Link to="/history" className="footer-link">My Creations</Link></li>
                        </ul>
                    </Col>

                    <Col lg={2} className="d-none d-lg-block" />
                </Row>

                <hr className="footer-divider my-4" />

                <Row className="gy-3 align-items-center text-center text-md-start">
                    <Col xs={12} md={4} className="order-3 order-md-1">
                        <p className="footer-copy mb-0">
                            © 2026 PICTORY. All rights reserved.
                        </p>
                    </Col>

                    <Col xs={12} md={8} className="order-2 order-md-3">
                        <div className="legal-links d-flex justify-content-center justify-content-md-end gap-3 gap-sm-4 flex-wrap">
                            <Link to="/about" className="footer-link footer-muted">Contact</Link>
                            <Link to="/subscription" className="footer-link footer-muted">Plans</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
