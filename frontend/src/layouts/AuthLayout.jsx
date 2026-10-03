import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GraduationCap } from 'lucide-react';

export const AuthLayout = () => {
  const { isAuthenticated, isTeacher } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={isTeacher ? '/teacher' : '/student'} replace />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '14px',
              borderRadius: '16px',
              background: 'var(--gradient-primary)',
              marginBottom: '16px',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <GraduationCap size={36} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '8px' }}>
            College <span className="gradient-text">Attendance</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Next-Generation Dynamic QR & Biometric Verification
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '32px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
