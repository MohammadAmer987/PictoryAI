import '../../css/Mainpagestyles.css'
import { useState, useEffect, useRef } from "react"
import Logo from "./Logo"
import NavMenu from "./NavMenu"
import AvatarMenu from "./AvatarMenu"

export default function Navbar({ user = null, onNavigate = () => {}, onLogout = () => {},  onUserUpdated = () => {},
                                   notifications = [],
                                   unreadCount = 0,
                                   onClearNotifications = () => {},}) {

    const [openMenu, setOpenMenu] = useState(null)
    const navRef = useRef(null)

    useEffect(() => {
        function handleClick(e) {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenMenu(null)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    function toggle(menu) {
        setOpenMenu((prev) => (prev === menu ? null : menu))
    }

    function handleNavigate(route) {
        setOpenMenu(null)
        onNavigate(route)
    }

    return (
        <nav className="navbar-react" ref={navRef} aria-label="Main navigation">
        
            <Logo />
            <NavMenu
                openMenu={openMenu}
                toggle={toggle}
                handleNavigate={handleNavigate}
            />

            <AvatarMenu
                user={user}
                openMenu={openMenu}
                toggle={toggle}
                handleNavigate={handleNavigate}
                onLogout={onLogout}
                onUserUpdated={onUserUpdated}
                notifications={notifications}
                unreadCount={unreadCount}
                onClearNotifications={onClearNotifications}

            />

        </nav>
    )
}