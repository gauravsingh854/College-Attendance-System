import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { sessionApi } from '../../api/sessionApi.js';
import {
  Users,
  CalendarCheck,
  Clock,
  PlusCircle,
  QrCode,
  ArrowUpRight,
} from 'lucide-react';

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await sessionApi.getMySessions();
        if (res?.data) {
          setSessions(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch teacher sessions:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>
            Faculty Overview, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage course attendance, active lecture sessions, and dynamic QR tokens
          </p>
        </div>
        <Link to="/teacher/create-session" className="btn btn-primary">
          <PlusCircle size={18} /> Launch Session
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="card-grid">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              ACTIVE SESSIONS
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)' }}>
              <Clock size={20} color="var(--accent-primary)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>
            {sessions.filter((s) => s.status === 'active').length}
          </div>
          <div style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', marginTop: '6px' }}>
            Dynamic QR token rotation enabled
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              TOTAL LECTURES HELD
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)' }}>
              <CalendarCheck size={20} color="var(--accent-cyan)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{sessions.length}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px' }}>
            Archived and verifiable in reports
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              STUDENT ROSTER
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)' }}>
              <Users size={20} color="var(--accent-emerald)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>48</div>
          <div style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', marginTop: '6px' }}>
            Enrolled with biometric consent
          </div>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="glass-panel" style={{ marginTop: '32px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Recent Attendance Sessions</h3>
          <Link to="/teacher/reports" style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All Reports <ArrowUpRight size={14} />
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
            <QrCode size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p>No attendance sessions created yet.</p>
            <Link to="/teacher/create-session" className="btn btn-secondary" style={{ marginTop: '12px' }}>
              Create Your First Session
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px' }}>Subject</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((sess) => (
                  <tr key={sess._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                      {sess.subject?.name || 'Computer Networks'}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {new Date(sess.startTime).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${sess.status === 'active' ? 'badge-present' : 'badge-late'}`}>
                        {sess.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                        Display QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
