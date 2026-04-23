import { Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import Hero from '../components/CaptionGenerating/Hero';
import GeneratorForm from '../components/CaptionGenerating/GeneratorForm';
import PreviewSection from '../components/CaptionGenerating/PreviewSection';
import ProTips from '../components/CaptionGenerating/ProTips';

function CaptionGenerating() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFormData, setLastFormData] = useState(null);

  const handleGenerate = async (formData) => {
    if (!formData) return;

    try {
      setLoading(true);
      setResults(null);
      setLastFormData(formData);

      const formPayload = new FormData();

      formPayload.append('product_name', formData.productName);
      formPayload.append('target_audience', formData.audience || '');
      formPayload.append('tone', formData.tone || '');
      formPayload.append('language', formData.lang || '');
      formPayload.append('description', formData.description || '');

      if (formData.imageFile) {
        formPayload.append('image', formData.imageFile);
      }


      const token = localStorage.getItem('access_token');

      const response = await fetch('http://127.0.0.1:8000/api/captions/generate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });
//

      const data = await response.json();

      if (!response.ok || !data.success) {
        setResults([
          {
            type: 'Error',
            icon: 'bi-exclamation-triangle-fill',
            content: data.message || 'Failed to generate captions.',
            tags: ['Try Again'],
          },
        ]);
        return;
      }

      setResults(data?.data?.captions || []);
    } catch (error) {
      console.error('Caption generation error:', error);

      setResults([
        {
          type: 'Error',
          icon: 'bi-exclamation-triangle-fill',
          content: 'Something went wrong while connecting to the server.',
          tags: ['Server Error'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div
          className="main-page-wrapper"
          style={{ backgroundColor: 'var(--light-bg-green)', minHeight: '100vh' }}
      >
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