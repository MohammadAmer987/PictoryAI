export default function NavMenu({ openMenu, toggle, handleNavigate }) {

    return (
        <div className="nav-center">

            <div
                className={`nav-item ${openMenu === 'tools' ? 'open' : ''}`}
                onClick={() => toggle('tools')}
            >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="1" y="1" width="6" height="6" rx="1.5" />
                    <rect x="9" y="1" width="6" height="6" rx="1.5" opacity=".5" />
                    <rect x="1" y="9" width="6" height="6" rx="1.5" opacity=".5" />
                    <rect x="9" y="9" width="6" height="6" rx="1.5" opacity=".3" />
                </svg>
                AI Tools
            </div>

            <button className="nav-item" onClick={() => handleNavigate('pricing')}>
                Pricing
            </button>

            <button className="nav-item" onClick={() => handleNavigate('history')}>
                My Content
                <span className="nav-badge">PRO</span>
            </button>

            <button className="nav-item" onClick={() => handleNavigate('history')}>
                History
            </button>

        </div>
    )
}