import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { studentApi } from '../../api/studentApi.js';
import { QrCode, ScanFace, ClipboardCheck, Award, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getDashboardData();
      setData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading dashboard...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--accent-rose)', padding: '20px' }}>{error}</div>;
  }

  const { todayClasses, subjectAttendance, hasLowAttendance, examEligible } = data || {};

  return (
    <div>
      {/* Low Attendance Alert */}
      {hasLowAttendance && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <AlertTriangle color="var(--accent-rose)" style={{ marginTop: '2px' }} />
          <div>
            <h4 style={{ color: 'var(--accent-rose)', margin: '0 0 4px 0', fontSize: '1rem' }}>Low Attendance Alert</h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>
              One or more subjects are below the required 75% attendance threshold. Please improve your attendance to ensure exam eligibility.
            </p>
          </div>
          <Link to="/student/attendance" className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}>
            View Details
          </Link>
        </div>
      )}

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

      {/* Exam Eligibility Card */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ padding: '16px', borderRadius: '50%', background: examEligible ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)' }}>
          {examEligible ? <Award size={32} color="var(--accent-emerald)" /> : <XCircle size={32} color="var(--accent-rose)" />}
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Exam Eligibility Status</h3>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: examEligible ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
            {examEligible ? 'Eligible for Exams' : 'At Risk / Not Eligible'}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            {examEligible ? 'You are meeting the 75% requirement across all subjects.' : 'You have subjects below the 75% attendance requirement.'}
          </p>
        </div>
      </div>

      {/* Today's Schedule */}
      <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Today's Schedule</h2>
      <div className="card-grid" style={{ marginBottom: '32px' }}>
        {todayClasses && todayClasses.length > 0 ? (
          todayClasses.map(({ session, isAttended }) => (
            <div key={session._id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{session.subject.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{session.subject.code} • {session.teacher.name}</div>
                </div>
                {isAttended ? (
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Attended
                  </span>
                ) : (
                  <span style={{ background: 'rgba(244, 163, 63, 0.15)', color: '#f59e0b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> Pending
                  </span>
                )}
              </div>
              
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>

              {!isAttended && (
                <Link to={`/student/scan`} className="btn btn-primary" style={{ width: '100%', padding: '8px' }}>
                  <QrCode size={16} /> Mark Attendance
                </Link>
              )}
            </div>
          ))
        ) : (
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <ClipboardCheck size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>No more classes today</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>You have no active sessions scheduled for today.</p>
          </div>
        )}
      </div>

      {/* Subject-wise Attendance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem' }}>Subject-wise Attendance</h2>
        <Link to="/student/attendance" style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', textDecoration: 'none' }}>
          View Full History →
        </Link>
      </div>
      
      <div className="card-grid">
        {subjectAttendance && subjectAttendance.length > 0 ? (
          subjectAttendance.map(({ subject, attended, total, percentage }) => {
            const isGood = percentage >= 75;
            const isWarning = percentage >= 65 && percentage < 75;
            const isDanger = percentage < 65;
            
            let color = 'var(--accent-emerald)';
            if (isWarning) color = '#f59e0b';
            if (isDanger) color = 'var(--accent-rose)';

            return (
              <div key={subject._id} className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{subject.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{subject.code}</div>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>{percentage}%</div>
                </div>

                {/* Progress Bar */}
                <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ height: '100%', width: `${percentage}%`, background: color, transition: 'width 0.5s ease' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Classes: <strong style={{ color: 'var(--text-primary)' }}>{attended} / {total}</strong></span>
                  {!isGood && (
                    <span style={{ color: 'var(--accent-rose)', fontWeight: 600, background: 'rgba(244, 63, 94, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      At Risk
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No subjects enrolled or attendance data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
