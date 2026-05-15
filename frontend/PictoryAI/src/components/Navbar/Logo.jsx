import { useState } from "react"
import { Link } from "react-router-dom"
import logo from "../../images/logo.png"

export default function Logo() {
    const [imageError, setImageError] = useState(false)

    return (
        <Link
            className="nav-logo"
            to="/"
            aria-label="Pictory AI home"
        >
            {!imageError ? (
                <img
                    src={logo}
                    alt="Pictory AI"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: "#043F34",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="#B6E5D2"
                    >
                        <polygon points="10,2 18,7 18,15 10,20 2,15 2,7" />
                    </svg>
                </div>
            )}
        </Link>
    )
}