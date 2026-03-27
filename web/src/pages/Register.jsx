import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        referredBy: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.auth.register(form);
            // Auto-login after registration: go to login page
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card glass-card page-enter" onSubmit={handleSubmit}>
                <h1>Create Account</h1>
                <p className="subtitle">Join MotiVerse and get inspired daily</p>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="form-group">
                    <label className="form-label" htmlFor="reg-name">Full Name</label>
                    <input
                        className="form-input"
                        id="reg-name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="reg-email">Email</label>
                    <input
                        className="form-input"
                        id="reg-email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="reg-password">Password</label>
                    <input
                        className="form-input"
                        id="reg-password"
                        type="password"
                        name="password"
                        placeholder="Create a strong password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="reg-referral">Referral Code <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
                    <input
                        className="form-input"
                        id="reg-referral"
                        type="text"
                        name="referredBy"
                        placeholder="e.g. JOH123"
                        value={form.referredBy}
                        onChange={handleChange}
                    />
                </div>

                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? <span className="spinner" /> : 'Create Account'}
                </button>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </form>
        </div>
    );
}

export default Register;
