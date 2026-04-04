export default function NavMenu({ openMenu, toggle, handleNavigate }) {

    return (
        <div className="nav-center">

            <div
                className={`nav-item dropdown ${openMenu === 'tools' ? 'open' : ''}`}
                onClick={() => toggle('tools')}
            >
                <div className="nav-trigger">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                        <rect x="1" y="1" width="6" height="6" rx="1.5" />
                        <rect x="9" y="1" width="6" height="6" rx="1.5" opacity=".5" />
                        <rect x="1" y="9" width="6" height="6" rx="1.5" opacity=".5" />
                        <rect x="9" y="9" width="6" height="6" rx="1.5" opacity=".3" />
                    </svg>
                    <span>AI Tools</span>
                </div>
                    <div className="dropdown-menu tools-dropdown">
                    
                    <div className="dropdown-header">
                        <h4>AI Tools</h4>
                        <p style={{ color: 'var(--mid-green)' }}>Choose a tool to get started</p>
                    </div>
                    
                    <div className="dropdown-items">
                        <div 
                            className="dropdown-item"
                            onClick={() => handleNavigate('/tools/caption-generator')}
                        >
                            <span className="dropdown-icon">
                              <i className="bi bi-magic fs-4 bg-primary-green text-white rounded p-2"></i>
                            </span>
                            <div>
                                <div className="dropdown-item-title">Caption for Images</div>
                                <div className="dropdown-item-desc">Generate engaging captions for your images</div>
                            </div>
                        </div>

                        <div
                            className="dropdown-item"
                            onClick={() => handleNavigate('/tools/enhance-image')}
                        >
                            <span className="dropdown-icon">
                              <i className="bi bi-stars fs-4 bg-primary-green text-white rounded p-2"></i>
                            </span>
                        <div>
                                <div className="dropdown-item-title">Enhance Product Image</div>
                                <div className="dropdown-item-desc">Turn your product image into a professional marketing photo</div>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>

            <button className="nav-item" onClick={() => handleNavigate('/pricing')}>
                Pricing
            </button>

            <button className="nav-item" onClick={() => handleNavigate('/history')}>
                My Content
                <span className="nav-badge">PRO</span>
            </button>

            <button className="nav-item" onClick={() => handleNavigate('/history')}>
                History
            </button>

        </div>
    )
}