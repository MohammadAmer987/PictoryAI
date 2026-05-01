import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectionGroup from './SelectionGroup';

function GeneratorForm({ onGenerate, isParentLoading, isLimitReached }) {
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('General');
  const [tone, setTone] = useState('Professional');
  const [lang, setLang] = useState('English');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const processImageFile = (file) => {
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PNG, JPG, or WEBP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB.');
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setImageUploaded(true);
  };

  const audienceList = [
    { name: 'Women', icon: 'bi-gender-female' },
    { name: 'Men', icon: 'bi-gender-male' },
    { name: 'Kids', icon: 'bi-emoji-smile' },
    { name: 'General', icon: 'bi-people' },
  ];

  const toneList = [
    { name: 'Luxury', icon: 'bi-gem' },
    { name: 'Friendly', icon: 'bi-heart' },
    { name: 'Funny', icon: 'bi-emoji-laughing' },
    { name: 'Professional', icon: 'bi-briefcase' },
  ];

  const languageList = [
    { name: 'English', icon: 'bi-globe2' },
    { name: 'Arabic', icon: 'bi-globe' },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    processImageFile(file);
  };

  const handleGenerate = (e) => {
    e.preventDefault();

    if (isLimitReached) return;

    setIsGenerated(true);

    if (onGenerate) {
      onGenerate({ productName, description, audience, tone, lang, imageFile });
    }
  };

  const isReady =
      imageUploaded &&
      productName.trim() !== '' &&
      !isParentLoading &&
      !isLimitReached;

  const showWarning = !isReady && !isParentLoading && !isGenerated && !isLimitReached;

  return (
      <Card className="generator-card shadow-sm rounded-4 bg-white border-0">
        <div className="card-header-custom p-4">
          <div className="d-flex align-items-center">
            <div className="icon-container-header rounded-3 me-3">
              <i className="bi bi-gear-fill fs-6 text-white"></i>
            </div>
            <div>
              <h6 className="mb-0 fw-bold" style={{ color: 'var(--primary-green)' }}>
                Product Details
              </h6>
              <p className="text-muted mb-0 extra-small">
                Fill in the info to generate captions
              </p>
            </div>
          </div>
        </div>

        <Card.Body className="p-4">
          {isLimitReached && (
              <Alert variant="warning" className="rounded-4 mb-4">
                <div className="d-flex align-items-start">
                  <i className="bi bi-lock-fill me-2 mt-1"></i>
                  <div>
                    <strong>Caption limit reached</strong>
                    <p className="mb-2 small">
                      You have used all available caption generations for this month.
                      Subscribe to continue now, or wait until next month for your limit
                      to reset.
                    </p>
                    <Button
                        size="sm"
                        className="rounded-pill px-3 fw-bold"
                        onClick={() => navigate('/pricing')}
                    >
                      View Plans
                    </Button>
                  </div>
                </div>
              </Alert>
          )}

          <Form onSubmit={handleGenerate}>
            <Form.Group className="mb-4 text-start">
              <Form.Label className="text-black fw-bold small">
                Product Image <span className="text-danger">*</span>
              </Form.Label>

              <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  hidden
                  disabled={isLimitReached}
              />

              <div
                  className={`upload-zone rounded-4 p-5 text-center ${
                      isDragging ? 'drag-active' : ''
                  }`}
                  onClick={() => {
                    if (!isLimitReached) fileInputRef.current?.click();
                  }}
                  onDragOver={isLimitReached ? undefined : handleDragOver}
                  onDragLeave={isLimitReached ? undefined : handleDragLeave}
                  onDrop={isLimitReached ? undefined : handleDrop}
                  role="button"
                  tabIndex={0}
                  style={{
                    opacity: isLimitReached ? 0.6 : 1,
                    cursor: isLimitReached ? 'not-allowed' : 'pointer',
                  }}
                  onKeyDown={(e) => {
                    if (!isLimitReached && (e.key === 'Enter' || e.key === ' ')) {
                      fileInputRef.current?.click();
                    }
                  }}
              >
                {preview ? (
                    <div className="mb-3">
                      <img
                          src={preview}
                          alt="preview"
                          className="rounded-3 shadow-sm"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                    </div>
                ) : (
                    <div className="upload-icon-box rounded-4 d-flex align-items-center justify-content-center shadow-sm mb-3">
                      <i className="bi bi-image-fill fs-3 text-white"></i>
                    </div>
                )}

                <p className="text-black small fw-bold mb-1">
                  Drop your product image here
                </p>
                <p className="extra-small text-muted mb-3">
                  or click to browse — PNG, JPG, WEBP up to 10MB
                </p>

                <Button
                    variant="primary"
                    className="btn-upload rounded-pill px-4 fw-bold small shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLimitReached) fileInputRef.current?.click();
                    }}
                    disabled={isLimitReached}
                >
                  {imageUploaded ? 'Change Image' : 'Upload Image'}
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3 text-start">
              <Form.Label className="text-black fw-bold small">
                Product Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Rose Gold Perfume Set"
                  className="custom-input rounded-3 py-2 small"
                  disabled={isLimitReached}
              />
            </Form.Group>

            <Form.Group className="mb-4 text-start">
              <Form.Label className="text-black fw-bold small">
                Product Description{' '}
                <span className="text-muted fw-normal">optional</span>
              </Form.Label>
              <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe your product..."
                  className="custom-input rounded-3 small"
                  disabled={isLimitReached}
              />
              <div className="text-end extra-small text-muted mt-1">
                {description.length}/200
              </div>
            </Form.Group>

            <SelectionGroup
                title="Target Audience"
                options={audienceList}
                activeValue={audience}
                onSelect={isLimitReached ? () => {} : setAudience}
                smCols={3}
            />

            <SelectionGroup
                title="Caption Tone"
                options={toneList}
                activeValue={tone}
                onSelect={isLimitReached ? () => {} : setTone}
                smCols={3}
            />

            <SelectionGroup
                title="Output Language"
                options={languageList}
                activeValue={lang}
                onSelect={isLimitReached ? () => {} : setLang}
                smCols={6}
            />

            <Button
                type="submit"
                className={`w-100 py-3 rounded-3 fw-bold mt-2 shadow border-0 transition-all ${
                    isReady ? 'btn-generate-active' : 'btn-generate-disabled'
                }`}
                disabled={!isReady}
            >
              {isParentLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Generating...
                  </>
              ) : isLimitReached ? (
                  <>
                    <i className="bi bi-lock-fill me-2"></i>
                    Limit reached - Subscribe to continue
                  </>
              ) : (
                  <>
                    <i className="bi bi-stars me-2 text-warning"></i>
                    Generate AI Captions
                  </>
              )}
            </Button>

            {showWarning && (
                <p className="text-warning extra-small text-center mt-3 d-flex align-items-center justify-content-center">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  Please fill all required fields and upload an image
                </p>
            )}
          </Form>
        </Card.Body>
      </Card>
  );
}

export default GeneratorForm;