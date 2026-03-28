import { Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import Hero from '../components/Hero'; 
import GeneratorForm from '../components/GeneratorForm';
import PreviewSection from '../components/PreviewSection';
import ProTips from '../components/ProTips';
function CaptionGenerating() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFormData, setLastFormData] = useState(null); 

  const handleGenerate = (formData) => {
    setLoading(true);
    setResults(null); 
    setLastFormData(formData); 

    setTimeout(() => {
      const simulatedData = [
        {
          type: 'Short Caption',
          icon: 'bi-lightning-fill',
          content: `The smart choice for ${formData.productName} — ${formData.description.substring(0, 30)}...`,
          tags: ['QualityFirst', 'TrustedBrand', 'SmartChoice']
        },
        {
          type: 'Promotional Caption',
          icon: 'bi-megaphone-fill',
          content: `✨ Introducing ${formData.productName} ✨ Perfect for ${formData.audience} who want the best. ${formData.description} — Don't miss out!`,
          tags: ['Excellence', 'ProvenResults', 'MustHave']
        },
        {
          type: 'Social Media Caption',
          icon: 'bi-instagram',
          content: `💚 Meet ${formData.productName}! Designed especially for ${formData.audience}. Drop a comment and let us know what you think! 👇`,
          tags: ['Trending', 'InstaGood', 'NewArrival']
        },
        {
          type: 'Call-to-Action Caption',
          icon: 'bi-cart-fill',
          content: `Ready to experience ${formData.productName}? Order now and enjoy an unforgettable experience! 🚀`,
          tags: ['ShopNow', 'BestDeal']
        }
      ];

      setResults(simulatedData);
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="main-page-wrapper" style={{ backgroundColor: 'var(--light-bg-green)', minHeight: '100vh' }}>
      
      <Hero />

      <Container className="pb-5 mt-4">
        <Row className="g-4">
          
          <Col lg={5} md={12}>
            <div className="h-100">
              <GeneratorForm 
                onGenerate={handleGenerate} 
                isParentLoading={loading} 
              />
            </div>
          </Col>

          <Col lg={7} md={12}>
            <div className="h-100">
              <PreviewSection 
                results={results} 
                loading={loading} 
                onRegenerate={() => handleGenerate(lastFormData)} 
              />
            </div>
          </Col>

        </Row>

        <ProTips />
      </Container>
      </div>
  );
}

export default CaptionGenerating;