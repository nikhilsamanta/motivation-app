import { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../api';
import './Refer.css';

function Refer() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [user, setUser] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, statsData] = await Promise.all([
                    api.auth.getProfile(),
                    api.auth.getReferrals()
                ]);
                setUser(profileData);
                setStats(statsData);
            } catch (err) {
                console.error('Failed to fetch referral data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const copyToClipboard = () => {
        if (user?.referralCode) {
            navigator.clipboard.writeText(user.referralCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
            </div>
        );
    }

    return (
        <div className="refer-page page-enter">
            <Navbar userName={user?.name} onLogout={handleLogout} />

            <main className="refer-main container">
                <h1 className="refer-title">Refer a Friend</h1>
                <p className="refer-subtitle">Share wisdom and grow the community</p>

                <div className="refer-hero glass-card">
                    <div className="hero-emoji">🤝</div>
                    <h2>Invite your friends</h2>
                    <p>Give your friends a daily dose of motivation. Share your unique code and see who joins!</p>
                    
                    <div className="code-section">
                        <label>Your Referral Code</label>
                        <div className="code-box">
                            <span className="code-text">{user?.referralCode || 'N/A'}</span>
                            <button className="copy-btn" onClick={copyToClipboard}>
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="stats-section glass-card">
                    <h3>Your Impact</h3>
                    <div className="stat-highlight">
                        <span className="stat-value">{stats?.referralCount || 0}</span>
                        <span className="stat-label">Friends Joined</span>
                    </div>

                    {stats?.referredUsers?.length > 0 && (
                        <div className="referral-list">
                            <h4>Recent Signups</h4>
                            {stats.referredUsers.map((rUser, idx) => (
                                <div key={idx} className="referral-item">
                                    <div className="user-avatar">
                                        {rUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="user-info">
                                        <p className="user-name">{rUser.name}</p>
                                        <p className="user-date">{new Date(rUser.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Refer;
