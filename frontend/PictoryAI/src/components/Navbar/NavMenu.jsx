export default function NavMenu({
    openMenu,
    toggle,
    handleNavigate,
    isLoggedIn,
    setShowPopup
}) {

    const handleProtectedNavigation = (path) => {

        // If user is not logged in
        if (!isLoggedIn) {
            setShowPopup(true)
            return
        }

        // If logged in
        handleNavigate(path)
    }

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

                        <p style={{ color: 'var(--mid-green)' }}>
                            Choose a tool to get started
                        </p>
                    </div>

                    <div className="dropdown-items">

                        {/* Caption Generator */}
                        <div
                            className="dropdown-item"
                            onClick={() =>
                                handleProtectedNavigation('/tools/caption-generator')
                            }
                        >
                            <span className="dropdown-icon">
                                <i className="bi bi-magic fs-4 bg-primary-green text-white rounded p-2"></i>
                            </span>

                            <div>
                                <div className="dropdown-item-title">
                                    Caption for Images
                                </div>

                                <div className="dropdown-item-desc">
                                    Generate engaging captions for your images
                                </div>
                            </div>
                        </div>

                        {/* Enhance Image */}
                        <div
                            className="dropdown-item"
                            onClick={() =>
                                handleProtectedNavigation('/tools/enhance-image')
                            }
                        >
                            <span className="dropdown-icon">
                                <i className="bi bi-stars fs-4 bg-primary-green text-white rounded p-2"></i>
                            </span>

                            <div>
                                <div className="dropdown-item-title">
                                    Enhance Product Image
                                </div>

                                <div className="dropdown-item-desc">
                                    Turn your product image into a professional marketing photo
                                </div>
                            </div>
                        </div>

                        {/* Theme Image Generation */}
                        <div
                            className="dropdown-item"
                            onClick={() =>
                                handleProtectedNavigation('/tools/theme-image-generation')
                            }
                        >
                            <span className="dropdown-icon">
                                <i className="bi bi-palette-fill fs-4 bg-primary-green text-white rounded p-2"></i>
                            </span>

                            <div>
                                <div className="dropdown-item-title">
                                    Theme Image Generation
                                </div>

                                <div className="dropdown-item-desc">
                                    Create ready-made images based on a selected theme
                                </div>
                            </div>
                        </div>

                        {/* Custom Image Generator */}
                        <div
                            className="dropdown-item"
                            onClick={() =>
                                handleProtectedNavigation('/tools/generate-image')
                            }
                        >
                            <span className="dropdown-icon">
                                <i className="bi bi-image fs-4 bg-primary-green text-white rounded p-2"></i>
                            </span>

                            <div>
                                <div className="dropdown-item-title">
                                    Custom Image Generator
                                </div>

                                <div className="dropdown-item-desc">
                                    Create a custom image with your name, text, and colors.
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <button
                className="nav-item"
                onClick={() => handleNavigate('/pricing')}
            >
                Pricing
            </button>

            <button
                className="nav-item"
                onClick={() => handleNavigate('/Contact Us')}
            >
                Contact Us
            </button>

            {/* Protected History Button */}
            <button
                className="nav-item"
                onClick={() =>
                    handleProtectedNavigation('/history')
                }
            >
                History
            </button>

        </div>
    )
}