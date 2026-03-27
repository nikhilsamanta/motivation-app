import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import QuoteCard from '../components/QuoteCard';
import { api } from '../api';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, quotesData] = await Promise.all([
                    api.auth.getProfile(),
                    api.quotes.getAll()
                ]);

                setUser(profileData);
                setQuotes(quotesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
            </div>
        );
    }

    return (
        <div className="dashboard-page page-enter">
            <Navbar userName={user?.name} onLogout={handleLogout} />

            <main className="dashboard-main container">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-greeting">
                            Hello, <span className="highlight">{user?.name || 'User'}</span> 👋
                        </h1>
                        <p className="dashboard-sub">Here are today's motivational quotes for you.</p>
                    </div>
                    <Link to="/profile" className="btn btn-secondary btn-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                    </Link>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {quotes.length === 0 ? (
                    <div className="empty-state glass-card">
                        <div className="empty-icon">📭</div>
                        <h3>No Quotes Yet</h3>
                        <p>Quotes will appear here once they're added to the system.</p>
                    </div>
                ) : (
                    <div className="quotes-grid">
                        {quotes.map((quote, index) => (
                            <QuoteCard key={quote._id} quote={quote} index={index} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
