import logo from '../../images/logo.png'

export default function Logo() {

    return (
        <a className="nav-logo" href="/" aria-label="Pictory AI home">
            <img
                src={logo}
                alt="Pictory AI"
                onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.nextSibling.style.display = "flex"
                }}
            />

            <div style={{
                display: "none",
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "#043F34",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#B6E5D2">
                    <polygon points="10,2 18,7 18,15 10,20 2,15 2,7" />
                </svg>
            </div>
        </a>
    )
}