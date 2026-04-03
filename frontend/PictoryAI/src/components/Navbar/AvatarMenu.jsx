export default function AvatarMenu({ user, openMenu, toggle, handleNavigate, onLogout }) {

    const initials = user
        ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : ""
        

    return (
        <div className="nav-right">

            {user ? (

                <div
                    className={`nav-avatar active ${openMenu === 'avatar' ? 'open' : ''}`}
                    onClick={() => toggle('avatar')}
                >

                    {initials}

                    <div className="avatar-dropdown">

                        <div className="avatar-header">
                            <div className="avatar-name">{user.name}</div>
                            <div className="avatar-email">
                                {user.email} · {user.plan} Plan
                            </div>
                        </div>

                        <div className="avatar-item" onClick={() => handleNavigate('/account')}>
                            My Account
                        </div>

                        <div className="avatar-item" onClick={() => handleNavigate('/history')}>
                            Content History
                        </div>

                        <div className="avatar-item" onClick={() => handleNavigate('/pricing')}>
                            Manage Subscription
                        </div>

                        <div className="dd-divider" />

                        <div className="avatar-item danger" onClick={onLogout}>
                            Sign Out
                        </div>

                    </div>

                </div>

            ) : (

                <button className="btn-login" onClick={() => handleNavigate('/login')}>
                              Log In                </button>

            )}

        </div>
    )
}