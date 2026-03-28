import { Form, Button, Card, Spinner } from 'react-bootstrap';
import { useState, useRef } from 'react';
import SelectionGroup from './SelectionGroup';

function GeneratorForm({ onGenerate, isParentLoading }) {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('General');
  const [tone, setTone] = useState('Professional');
  const [lang, setLang] = useState('English');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [preview, setPreview] = useState(null); 
const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
const [isGenerated, setIsGenerated] = useState(false); 
  const fileInputRef = useRef(null); 

  const audienceList = [
    { name: 'Women', icon: 'bi-gender-female' },
    { name: 'Men', icon: 'bi-gender-male' },
    { name: 'Kids', icon: 'bi-emoji-smile' },
    { name: 'General', icon: 'bi-people' }
  ];

  const toneList = [
    { name: 'Luxury', icon: 'bi-gem' },
    { name: 'Friendly', icon: 'bi-heart' },
    { name: 'Funny', icon: 'bi-emoji-laughing' },
    { name: 'Professional', icon: 'bi-briefcase' }
  ];

const languageList = [
  { name: 'English', icon: 'bi-globe2' },
  { name: 'Arabic', icon: 'bi-globe' }
];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
if (file) {
  setImageFile(file);
  setPreview(URL.createObjectURL(file));
  setImageUploaded(true);
}
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerated(true); 
    
   
    if (onGenerate) {
      onGenerate({ productName, description, audience, tone, lang, imageFile});
    }
  };

  
const isReady = imageUploaded && productName.trim() !== '' && description.trim() !== '' && !loading;
const showWarning = !isReady && !loading && !isGenerated;
  return (
    <Card className="generator-card shadow-sm rounded-4 bg-white border-0">
{/* card Header */}
      <div className="card-header-custom p-4">
        <div className="d-flex align-items-center">
          <div className="icon-container-header rounded-3 me-3">
            <i className="bi bi-gear-fill fs-6 text-white"></i>
          </div>
          <div>
            <h6 className="mb-0 fw-bold" style={{ color: 'var(--primary-green)' }}>Product Details</h6>
            <p className="text-muted mb-0 extra-small">Fill in the info to generate captions</p>
          </div>
        </div>
      </div>
{/* card body  */}
      <Card.Body className="p-4">
        <Form onSubmit={handleGenerate}>
          {/* Image Upload Area */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold small">Product Image <span className="text-danger">*</span></Form.Label>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              hidden 
            />

            <div className="upload-zone rounded-4 p-5 text-center">
              {preview ? (
                <div className="mb-3">
                   <img src={preview} alt="preview" className="rounded-3 shadow-sm" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                </div>
              ) : (
                <div className="upload-icon-box rounded-4 d-flex align-items-center justify-content-center shadow-sm mb-3">
                  <i className="bi bi-image-fill fs-3 text-white"></i>
                </div>
              )}
              
              <p className="small fw-bold mb-1">Drop your product image here</p>
              <p className="extra-small text-muted mb-3">or click to browse — PNG, JPG, WEBP up to 10MB</p>
              
              <Button 
                variant="primary" 
                className="btn-upload rounded-pill px-4 fw-bold small shadow-sm"
                onClick={() => fileInputRef.current.click()}
              >
                {imageUploaded ? 'Change Image' : 'Upload Image'}
              </Button>
            </div>
          </Form.Group>

          {/* Product Name */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold small">Product Name <span className="text-danger">*</span></Form.Label>
            <Form.Control 
              type="text" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Rose Gold Perfume Set" 
              className="custom-input rounded-3 py-2 small" 
            />
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold small">Product Description <span className="text-danger">*</span></Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe your product..." 
              className="custom-input rounded-3 small" 
            />
            <div className="text-end extra-small text-muted mt-1">{description.length}/200</div>
          </Form.Group>

          {/* Selection Groups */}
          <SelectionGroup title="Target Audience" options={audienceList} activeValue={audience} onSelect={setAudience} smCols={3} />
          <SelectionGroup title="Caption Tone" options={toneList} activeValue={tone} onSelect={setTone} smCols={3}/>
          <SelectionGroup title="Output Language" options={languageList} activeValue={lang} onSelect={setLang} smCols={6} />

          {/* Submit Button */}
          <Button 
            type="submit"
            className={`w-100 py-3 rounded-3 fw-bold mt-2 shadow border-0 transition-all ${isReady ? 'btn-generate-active' : 'btn-generate-disabled'}`}
            disabled={!isReady}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Generating...
              </>
            ) : (
              <>
                <i className="bi bi-stars me-2 text-warning"></i> Generate AI Captions
              </>
            )}
          </Button>
          
       {showWarning && (
            <p className="text-warning extra-small text-center mt-3 d-flex align-items-center justify-content-center">
               <i className="bi bi-exclamation-circle me-2"></i> Please fill all required fields and upload an image
            </p>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default GeneratorForm;