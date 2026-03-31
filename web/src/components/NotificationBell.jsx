import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import './NotificationBell.css';

function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await api.auth.getNotifications();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Check for new notifications every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications();
        }
    };

    const handleRead = async (id, isRead) => {
        if (isRead) return;
        try {
            await api.auth.markNotificationRead(id);
            setNotifications(notifications.map(n => 
                n._id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.auth.markAllNotificationsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInHours = Math.abs(now - date) / 36e5;
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'daily_quote': return '🌟';
            case 'referral': return '🤝';
            default: return '📢';
        }
    };

    return (
        <div className="notification-container" ref={dropdownRef}>
            <button className="notification-trigger" onClick={toggleDropdown}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button className="mark-all-btn" onClick={handleMarkAllRead}>
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {loading && notifications.length === 0 ? (
                            <div className="notification-empty">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="notification-empty">
                                <div className="notification-empty-icon">🔔</div>
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification._id} 
                                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                    onClick={() => handleRead(notification._id, notification.isRead)}
                                >
                                    <div className="notification-icon-container">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-title">{notification.title}</div>
                                        <div className="notification-message">{notification.message}</div>
                                        <div className="notification-time">{formatDate(notification.createdAt)}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="notification-footer">
                        <a href="/notifications">View all activity</a>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
