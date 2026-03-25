import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
    return (
        <div className="landing-page page-enter">
            {/* Animated background orbs */}
            <div className="landing-orb landing-orb-1" />
            <div className="landing-orb landing-orb-2" />
            <div className="landing-orb landing-orb-3" />

            <nav className="landing-nav container">
                <div className="landing-logo">
                    <span className="logo-icon">✦</span> MotiVerse
                </div>
                <div className="landing-nav-actions">
                    <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
                    <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                </div>
            </nav>

            <main className="landing-hero container">
                <div className="hero-badge">🚀 Your daily dose of inspiration</div>
                <h1 className="hero-title">
                    Fuel Your Day With<br />
                    <span className="hero-highlight">Powerful Quotes</span>
                </h1>
                <p className="hero-subtitle">
                    Discover curated motivational quotes every day. Build habits, stay inspired,
                    and share wisdom with friends through referrals.
                </p>
                <div className="hero-actions">
                    <Link to="/register" className="btn btn-primary btn-lg">
                        Get Started Free
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                    <Link to="/login" className="btn btn-outline btn-lg">
                        I Have an Account
                    </Link>
                </div>

                {/* Feature cards */}
                <div className="hero-features">
                    <div className="feature-card glass-card">
                        <div className="feature-icon">💡</div>
                        <h3>Daily Quotes</h3>
                        <p>Fresh motivational quotes delivered to you every single day.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">🤝</div>
                        <h3>Refer Friends</h3>
                        <p>Share your referral code and grow the community together.</p>
                    </div>
                    <div className="feature-card glass-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Stay Consistent</h3>
                        <p>Build a daily habit of reading and reflecting on wisdom.</p>
                    </div>
                </div>
            </main>

            <footer className="landing-footer">
                <p>Built with ❤️ — MotiVerse © 2026</p>
            </footer>
        </div>
    );
}

export default Landing;
