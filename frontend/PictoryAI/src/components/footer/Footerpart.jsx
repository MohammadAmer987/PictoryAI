import { Container, Row, Col, Form, Button } from 'react-bootstrap';
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

                        <div className="newsletter-box d-flex justify-content-center justify-content-lg-start">
                            <div className="position-relative newsletter-wrapper">
                                <Form.Control
                                    type="email"
                                    placeholder="Your email"
                                    className="custom-footer-input rounded-3 py-2 ps-3 pe-5 text-white small w-100"
                                />
                                <Button className="btn-footer-subscribe position-absolute top-0 end-0 h-100 rounded-3 px-3 border-0">
                                    <i className="bi bi-envelope"></i>
                                </Button>
                            </div>
                        </div>
                    </Col>

                    <Col xs={6} md={4} lg={2} className="text-center text-md-start">
                        <h6 className="footer-heading mb-3">Explore</h6>
                        <ul className="list-unstyled footer-list mb-0">
                            <li><a href="#features" className="footer-link">Features</a></li>
                            <li><a href="#pricing" className="footer-link">Pricing</a></li>
                            <li><a href="#examples" className="footer-link">Examples</a></li>
                        </ul>
                    </Col>

                    <Col xs={6} md={4} lg={2} className="text-center text-md-start">
                        <h6 className="footer-heading mb-3">Company</h6>
                        <ul className="list-unstyled footer-list mb-0">
                            <li><a href="#about" className="footer-link">About Us</a></li>
                            <li><a href="#careers" className="footer-link">Careers</a></li>
                            <li><a href="#blog" className="footer-link">Blog</a></li>
                        </ul>
                    </Col>

                    <Col xs={12} md={4} lg={2} className="text-center text-md-start">
                        <h6 className="footer-heading mb-3">Support</h6>
                        <ul className="list-unstyled footer-list mb-0">
                            <li><a href="#help" className="footer-link">Help Center</a></li>
                            <li><a href="#api" className="footer-link">API Docs</a></li>
                            <li><a href="#contact" className="footer-link">Contact Us</a></li>
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

                    <Col xs={12} md={4} className="order-1 order-md-2">
                        <div className="social-icons d-flex justify-content-center gap-2 flex-wrap">
                            {['linkedin', 'twitter-x', 'instagram', 'facebook'].map((social) => (
                                <a
                                    key={social}
                                    href={`#${social}`}
                                    className="social-link"
                                >
                                    <i className={`bi bi-${social}`}></i>
                                </a>
                            ))}
                        </div>
                    </Col>

                    <Col xs={12} md={4} className="order-2 order-md-3">
                        <div className="legal-links d-flex justify-content-center justify-content-md-end gap-3 gap-sm-4 flex-wrap">
                            <a href="#privacy" className="footer-link footer-muted">Privacy Policy</a>
                            <a href="#terms" className="footer-link footer-muted">Terms of Service</a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;