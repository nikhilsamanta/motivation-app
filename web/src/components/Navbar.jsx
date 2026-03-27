import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ userName, onLogout }) {
    return (
        <nav className="app-navbar">
            <div className="container navbar-inner">
                <Link to="/dashboard" className="navbar-logo">
                    <span className="logo-icon">✦</span> MotiVerse
                </Link>

                <div className="navbar-right">
                    <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                    <Link to="/refer" className="navbar-link">Refer</Link>
                    <Link to="/profile" className="navbar-link">Profile</Link>
                    <div className="navbar-divider" />
                    <div className="navbar-user">
                        <div className="navbar-avatar">
                            {userName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="navbar-name">{userName || 'User'}</span>
                    </div>
                    <button className="btn btn-sm btn-danger" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
