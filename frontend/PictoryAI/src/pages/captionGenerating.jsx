import { Container, Row, Col } from 'react-bootstrap';
import { useState,useEffect  } from 'react';
import Hero from '../components/CaptionGenerating/Hero';
import GeneratorForm from '../components/CaptionGenerating/GeneratorForm';
import PreviewSection from '../components/CaptionGenerating/PreviewSection';
import ProTips from '../components/CaptionGenerating/ProTips';

function CaptionGenerating({ addNotification = () => {} }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFormData, setLastFormData] = useState(null);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);


  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const token = localStorage.getItem('access_token');

        const res = await fetch('http://127.0.0.1:8000/api/captions/my-plan', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const data = await res.json();

        setIsPremiumUser(data?.data?.is_premium === true);
      } catch (err) {
        console.error('Failed to fetch user plan', err);
      }
    };

    fetchUserPlan();
  }, []);
  const handleGenerate = async (formData) => {
    if (!formData || isLimitReached) return;

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
      }else if (!formData.imageFile) {
        setResults([
          {
            type: 'Error',
            content: 'Please upload an image',
          },
        ]);
        return;
      }

      const token = localStorage.getItem('access_token');

      for (let pair of formPayload.entries()) {
        console.log(pair[0], pair[1]);
      }
      const response = await fetch(
          'http://127.0.0.1:8000/api/captions/generate',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: formPayload,
          }
      );

      const data = await response.json();

      if (response.status === 403 && data.upgrade_required) {
        setIsLimitReached(true);

        setResults([
          {
            type: 'Limit Reached',
            icon: 'bi-lock-fill',
            content:
                data.message ||
                'You have reached your caption generation limit. Please subscribe to continue.',
            tags: ['Subscribe'],
            upgradeRequired: true,
          },
        ]);

        return;
      }


      console.log('STATUS:', response.status);
      console.log('FULL RESPONSE:', data);

      if (!response.ok || !data.success) {
        setResults([
          {
            type: 'Error',
            icon: 'bi-exclamation-triangle-fill',
            content:
                data.message ||
                (data.errors ? JSON.stringify(data.errors, null, 2) : '') ||
                'Failed to generate captions.',
            tags: ['Try Again'],
          },
        ]);
        return;
      }

      setIsLimitReached(false);
      setResults(data?.data?.captions || []);
      await addNotification({ type: "caption" });
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
                    isLimitReached={isLimitReached}
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

          <ProTips show={!isPremiumUser} />
        </Container>
      </div>
  );
}

export default CaptionGenerating;