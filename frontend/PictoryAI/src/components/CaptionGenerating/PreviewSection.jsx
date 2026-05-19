import { Card, Button, Badge, Stack, Spinner } from 'react-bootstrap';
import { useState } from 'react';

function PreviewSection({ results, loading, onRegenerate }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const isRtlText = (text) => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const allText = results.map(r => `${r.type}:\n${r.content}`).join('\n\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const RenderHeader = ({ showAction = false }) => (
    <div className="card-header-custom p-4 border-bottom border-light">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div className="icon-container-header rounded-3 me-3">
            <i className="bi bi-feather fs-6"></i>
          </div>
          <div>
            <h6 className="mb-0 fw-bold" style={{ color: 'var(--primary-green)' }}>Generated Captions</h6>
            <p className="text-muted mb-0 extra-small">AI-crafted marketing copy for your product</p>
          </div>
        </div>
        {showAction && (
          <Button 
            variant="outline-success" 
            size="sm" 
            className="rounded-pill extra-small px-3 border-success-subtle fw-bold transition-all shadow-sm"
            onClick={onRegenerate}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Regenerate
          </Button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card className="generator-card shadow-sm rounded-4 bg-white h-100 p-0 border-0">
        <RenderHeader />
        <div className="p-4 card-header-custom">
          <div className="mb-3 d-flex align-items-center">
             <Spinner animation="grow" size="sm" className="me-2" style={{ color: 'var(--primary-green)', width: '10px', height: '10px' }} />
             <span className="small fw-bold text-muted">Generating captions...</span>
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} className="mb-4 p-3 rounded-3 border border-light opacity-50">
               <div className="skeleton-box mb-3" style={{ width: '30%', height: '12px', background: '#f0f0f0' }}></div>
               <div className="skeleton-line mb-2" style={{ width: '100%', height: '10px', background: '#f8f8f8' }}></div>
               <div className="skeleton-line mb-3" style={{ width: '80%', height: '10px', background: '#f8f8f8' }}></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="generator-card shadow-sm rounded-4 bg-white h-100 p-0 border-0">
        <RenderHeader />
<div className="d-flex flex-column align-items-center mt-4 pt-5  px-3 text-center"   style={{ minHeight: '420px' }}>     
       <div className="icon-box-bg d-flex align-items-center justify-content-center mb-4 shadow-sm" 
               style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: '#f0f7f5' }}>
            <i className="bi bi-stars fs-1" style={{ color: 'var(--secondary-green)' }}></i>
          </div>
          
          <h5 className="fw-bold mb-2" style={{ color: 'var(--primary-green)' }}>Your Captions Will Appear Here</h5>
          <p className="text-muted small mx-auto mb-5" style={{ maxWidth: '300px' }}>
            Upload a product image, fill in the details on the left, and click <span className="fw-bold" style={{ color: 'var(--secondary-green)' }}>Generate AI Captions</span> to get started.
          </p>

          <div className="d-flex gap-3 mt-2">
             {[1, 2, 3].map(i => (
               <div key={i} className="rounded-3" style={{ width: '60px', height: '60px', backgroundColor: '#f8fdfb', border: '1px solid #edf2f0' }}></div>
             ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="generator-card shadow-sm rounded-4 bg-white h-100 p-0 border-0">
      <RenderHeader showAction={true} />

      <div className="p-4 overflow-auto" style={{ maxHeight: '1100px' }}>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <span className="small fw-bold" style={{ color: 'var(--secondary-green)' }}>
             <i className="bi bi-circle-fill me-2 extra-small" style={{ fontSize: '8px' }}></i>
             {results.length} Captions Generated
          </span>
          <Button 
            variant={copiedAll ? "success" : "light"} 
            size="sm" 
            className={`extra-small border px-3 rounded-pill shadow-sm transition-all ${copiedAll ? 'text-white border-0' : 'text-muted'}`}
            onClick={handleCopyAll}
          >
            {copiedAll ? <><i className="bi bi-check-lg me-1"></i> Copied All!</> : <><i className="bi bi-files me-1"></i> Copy All</>}
          </Button>
        </div>

        <Stack gap={3}>
          {results.map((item, index) => (
            <Card
              key={index}
              className="border-light rounded-4 p-3 shadow-none transition-all hover-shadow"
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center">
                  <div className="bg-light p-2 rounded-3 me-2 text-secondary" style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <span className="extra-small fw-bold text-dark text-uppercase tracking-wider">{item.type}</span>
                </div>
                <Button 
                  variant={copiedIndex === index ? "success" : "light"} 
                  size="sm" 
                  className={`extra-small border px-3 rounded-pill transition-all ${copiedIndex === index ? 'text-white border-0' : 'text-muted'}`}
                  onClick={() => handleCopy(item.content, index)}
                >
                  {copiedIndex === index ? 'Copied!' : 'Copy'}
                </Button>
              </div>
                {(() => {
                  const isRtl = isRtlText(item.content);

                  return (
                <p
                    className="align-content-lg-start text-secondary mb-3 fw-medium"
                    dir={isRtl ? 'rtl' : 'ltr'}
                    style={{
                        fontSize: '1rem',
                        lineHeight: '1.9',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        overflow: 'visible',
                        textAlign: isRtl ? 'right' : 'left',
                    }}
                >
                    {item.content}
                </p>
                  );
                })()}
              <div className="d-flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <Badge key={tag} bg="light" text="success" className="fw-normal border border-success-subtle extra-small py-1 px-3 rounded-pill">#{tag}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </Stack>
      </div>
    </Card>
  );
}

export default PreviewSection;
