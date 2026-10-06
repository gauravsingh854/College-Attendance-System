import React, { useState, useEffect } from 'react';
import { studentApi } from '../../api/studentApi.js';
import { Bell, CheckCircle2 } from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await studentApi.getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.warn('Could not load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await studentApi.readNotification(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {}
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
          <Bell size={24} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}/> 
          <span className="gradient-text">Notifications</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Alerts, reminders, and updates on your attendance.
        </p>
      </div>

      <div className="card-grid">
        {loading ? (
          <div style={{ padding: '32px', color: 'var(--text-secondary)' }}>Loading notifications...</div>
        ) : notifications.length > 0 ? (
          notifications.map(n => (
            <div key={n._id} className="glass-panel" style={{ padding: '20px', gridColumn: '1 / -1', borderLeft: n.isRead ? 'none' : '4px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: n.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{n.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{n.message}</p>
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '8px', display: 'block' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>
                {!n.isRead && (
                  <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem' }} onClick={() => handleMarkRead(n._id)}>
                    <CheckCircle2 size={14} style={{ marginRight: '4px' }}/> Mark Read
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <p style={{ color: 'var(--text-secondary)' }}>You're all caught up! No notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
