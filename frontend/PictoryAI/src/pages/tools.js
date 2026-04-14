import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AiToolsPage() {
  const tools = [
    {
      title: "Caption Generator",
      desc: "Create engaging social media captions using AI image analysis.",
      path: "/tools/caption-generator",
      icon: "bi-magic",
      status: "Active"
    },
    {
      title: "Enhance Image",
      desc: "Transform your product image into a professional marketing visual.",
      path: "/tools/enhance-image",
      icon: "bi-stars",
      status: "Active"
    },
    {
      title: "Theme Image Generation",
      desc: "Create ready-made images based on a selected theme.",
      path: "/tools/theme-image-generation",
      icon: "bi-brush-fill",
      status: "Active"
    },
    {
      title: "Background Remover",
      desc: "Instantly remove backgrounds from your product photos.",
      path: "#", // غير مفعلة حالياً
      icon: "bi-layers-half",
      status: "Coming Soon"
    }
  ];

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--light-bg-green)', minHeight: '100vh' }}>
      <Container>
        <div className="mb-5">
          <h2 className="fw-bold text-primary-green">AI Marketing Tools</h2>
          <p className="text-secondary">Choose the tool you want to use today.</p>
        </div>

        <Row className="g-4">
          {tools.map((tool, index) => (
            <Col key={index} md={6} lg={4}>
              <Card 
                as={tool.status === "Active" ? Link : 'div'} 
                to={tool.path} 
                className={`h-100 border-0 shadow-sm p-3 text-decoration-none transition-all ${tool.status === "Active" ? 'hover-shadow' : 'opacity-75'}`}
              >
                <Card.Body>
                  <div className="bg-primary-green text-white rounded-3 d-inline-flex p-3 mb-3">
                    <i className={`bi ${tool.icon} fs-4`}></i>
                  </div>
                  <Card.Title className="fw-bold text-dark d-flex align-items-center justify-content-between">
                    {tool.title}
                    <Badge bg={tool.status === "Active" ? "success" : "secondary"} className="extra-small fw-normal">
                      {tool.status}
                    </Badge>
                  </Card.Title>
                  <Card.Text className="text-muted small">
                    {tool.desc}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default AiToolsPage;