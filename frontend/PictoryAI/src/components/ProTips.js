import { Button } from 'react-bootstrap';

function ProTips() {
  return (
    <div className="mt-5 pb-5">
      <div 
        className="rounded-4 p-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 shadow-sm border-0"
        style={{ 
          background: 'linear-gradient(135deg, #0f3f34 0%, #4a7c6d 100%)',
          color: 'white'
        }}
      >
        {/* LEFT */}
        <div className="d-flex align-items-start align-items-md-center gap-3">
          <div 
            className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', width: '45px', height: '45px' }}
          >
            <i className="bi bi-stars fs-5"></i>
          </div>

          <div>
            <h6 className="mb-1 fw-bold">
              Unlock Unlimited Captions ✨
            </h6>

            <p className="mb-0 extra-small opacity-75">
              Free plan includes limited generations. Upgrade to Pro for unlimited captions, faster results, and more creative control.
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <Button 
          className="bg-white text-dark rounded-pill fw-bold px-4 extra-small shadow-sm border-0 py-2 align-self-md-center"
        >
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}

export default ProTips;