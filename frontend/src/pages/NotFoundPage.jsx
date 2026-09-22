import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <div style={{ fontSize: '5rem', fontWeight: 800 }} className="gradient-text">
        404
      </div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: '24px' }}>
        The requested resource or dashboard view could not be located.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={18} /> Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
