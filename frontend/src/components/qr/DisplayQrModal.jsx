import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, RefreshCw, AlertTriangle } from 'lucide-react';
import { sessionApi } from '../../api/sessionApi.js';

export const DisplayQrModal = ({ sessionId, onClose }) => {
  const [qrToken, setQrToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  const fetchToken = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await sessionApi.getSessionQr(sessionId);
      if (res?.data?.qrToken) {
        setQrToken(res.data.qrToken);
        setTimeLeft(res.data.refreshIntervalSeconds || 30);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to generate dynamic QR token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, [sessionId]);

  useEffect(() => {
    if (!qrToken || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          fetchToken();
          return 30; // Reset temporarily while fetching
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [qrToken, loading]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '90%',
          maxWidth: '450px',
          padding: '32px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Active Session QR</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px' }}>
          Project this code. It rotates securely.
        </p>

        {loading && !qrToken ? (
          <div style={{ padding: '60px', color: 'var(--accent-cyan)' }}>
            <RefreshCw size={48} className="spin" />
            <div style={{ marginTop: '16px' }}>Generating Secure Token...</div>
          </div>
        ) : error ? (
          <div style={{ padding: '40px', color: 'var(--accent-rose)' }}>
            <AlertTriangle size={48} style={{ margin: '0 auto 16px' }} />
            <div>{error}</div>
            <button className="btn btn-secondary" style={{ marginTop: '24px' }} onClick={fetchToken}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                display: 'inline-block',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                marginBottom: '24px',
              }}
            >
              <QRCodeSVG
                value={JSON.stringify({ sessionId, token: qrToken })}
                size={240}
                bgColor="#ffffff"
                fgColor="#000000"
                level="Q"
                includeMargin={false}
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: timeLeft <= 5 ? 'var(--accent-rose)' : 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'color 0.3s ease'
            }}>
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
              Refreshes in {timeLeft}s
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DisplayQrModal;
