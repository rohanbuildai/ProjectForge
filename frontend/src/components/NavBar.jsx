import "../styles/dashboard/Navbar.css";

function NavBar({user}) {

    return (
        <nav className="navbar">

            <div className="navbar-logo">
                ⚡ ProjectForge
            </div>

            <div className="navbar-right">

                <button className="notification-btn">
                    🔔
                </button>

                <div className="user-profile">
                    👤{user.name}
                </div>

            </div>

        </nav>
    );
}

export default NavBar;