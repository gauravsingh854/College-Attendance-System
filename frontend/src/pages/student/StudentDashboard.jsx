import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { QrCode, ScanFace, ClipboardCheck, Award } from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>
            Hello, <span className="gradient-text">{user?.name || 'Student'}</span> 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Track your semester attendance, scan rotating classroom QR codes, and check exam eligibility
          </p>
        </div>

        <Link to="/student/scan" className="btn btn-primary">
          <QrCode size={18} /> Scan Classroom QR
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="card-grid">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              OVERALL ATTENDANCE
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)' }}>
              <Award size={20} color="var(--accent-emerald)" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            88.5%
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px' }}>
            Requirement: ≥75% (Eligible for Exams)
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              CLASSES ATTENDED
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)' }}>
              <ClipboardCheck size={20} color="var(--accent-primary)" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>46 / 52</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px' }}>
            Across all enrolled subjects
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              BIOMETRIC STATUS
            </span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)' }}>
              <ScanFace size={20} color="var(--accent-cyan)" />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '8px' }}>
            Verified
          </div>
          <div style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', marginTop: '6px' }}>
            Face embedding encrypted & stored
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div
        className="glass-panel"
        style={{
          marginTop: '32px',
          padding: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Ready for today's lecture?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Scan the teacher's active projected QR code. Your location and facial biometric verification will validate your presence.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/student/scan" className="btn btn-primary">
            <QrCode size={18} /> Open Scanner
          </Link>
          <Link to="/student/face-enroll" className="btn btn-secondary">
            <ScanFace size={18} /> Manage Biometrics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
