import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', backgroundColor: 'var(--light-bg-green)' }}>
      <Container className="text-center">
        <h1 className="display-3 fw-bold text-primary-green mb-3">Welcome to PICTORY</h1>
        <p className="fs-5 text-secondary mb-4 mx-auto" style={{ maxWidth: '600px' }}>
          Your all-in-one AI platform to transform product images into professional marketing content.
        </p>
        <Button as={Link} to="/tools" size="lg" className="btn-generate-active px-5 py-3 rounded-pill border-0">
          Explore AI Tools <i className="bi bi-arrow-right ms-2"></i>
        </Button>
      </Container>
    </div>
  );
}

export default HomePage;