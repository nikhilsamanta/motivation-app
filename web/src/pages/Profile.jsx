import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../api';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [user, setUser] = useState(null);
    const [nameForm, setNameForm] = useState('');
    const [passwordForm, setPasswordForm] = useState('');
    const [nameMsg, setNameMsg] = useState({ type: '', text: '' });
    const [passMsg, setPassMsg] = useState({ type: '', text: '' });
    const [loadingName, setLoadingName] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.auth.getProfile();
                setUser(data);
                setNameForm(data.name || '');
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleNameUpdate = async (e) => {
        e.preventDefault();
        setNameMsg({ type: '', text: '' });
        setLoadingName(true);

        try {
            const data = await api.auth.updateName(nameForm);
            setUser(data);
            setNameMsg({ type: 'success', text: 'Name updated successfully!' });
        } catch (err) {
            setNameMsg({ type: 'error', text: err.message });
        } finally {
            setLoadingName(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPassMsg({ type: '', text: '' });

        if (passwordForm.length < 6) {
            setPassMsg({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoadingPass(true);

        try {
            await api.auth.changePassword(passwordForm);
            setPassMsg({ type: 'success', text: 'Password changed successfully!' });
            setPasswordForm('');
        } catch (err) {
            setPassMsg({ type: 'error', text: err.message });
        } finally {
            setLoadingPass(false);
        }
    };

    return (
        <div className="profile-page page-enter">
            <Navbar userName={user?.name} onLogout={handleLogout} />

            <main className="profile-main container">
                <h1 className="profile-title">Your Profile</h1>
                <p className="profile-subtitle">Manage your account settings</p>

                {/* User Info */}
                <div className="profile-info glass-card">
                    <div className="profile-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                        <h2>{user?.name}</h2>
                        <p className="profile-email">{user?.email}</p>
                        {user?.referralCode && (
                            <div className="referral-badge">
                                Referral Code: <strong>{user.referralCode}</strong>
                            </div>
                        )}
                    </div>
                </div>

                <div className="profile-forms">
                    {/* Change Name */}
                    <form className="profile-form glass-card" onSubmit={handleNameUpdate}>
                        <h3>Change Name</h3>

                        {nameMsg.text && (
                            <div className={`alert alert-${nameMsg.type}`}>{nameMsg.text}</div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="profile-name">Full Name</label>
                            <input
                                className="form-input"
                                id="profile-name"
                                type="text"
                                value={nameForm}
                                onChange={(e) => setNameForm(e.target.value)}
                                required
                            />
                        </div>

                        <button className="btn btn-primary" type="submit" disabled={loadingName}>
                            {loadingName ? <span className="spinner" /> : 'Update Name'}
                        </button>
                    </form>

                    {/* Change Password */}
                    <form className="profile-form glass-card" onSubmit={handlePasswordChange}>
                        <h3>Change Password</h3>

                        {passMsg.text && (
                            <div className={`alert alert-${passMsg.type}`}>{passMsg.text}</div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="profile-password">New Password</label>
                            <input
                                className="form-input"
                                id="profile-password"
                                type="password"
                                placeholder="Min 6 characters"
                                value={passwordForm}
                                onChange={(e) => setPasswordForm(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <button className="btn btn-primary" type="submit" disabled={loadingPass}>
                            {loadingPass ? <span className="spinner" /> : 'Change Password'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Profile;
