import React, { useState } from 'react';
import { attendanceApi } from '../../api/attendanceApi.js';
import { QrCode, CheckCircle2, AlertCircle, Camera } from 'lucide-react';

export const ScanQrPage = () => {
  const [qrToken, setQrToken] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await attendanceApi.markAttendance({
        sessionId: sessionId.trim(),
        qrToken: qrToken.trim(),
        verificationMethod: 'qr_only',
      });
      setStatusMessage({
        type: 'success',
        text: res?.message || 'Attendance recorded successfully!',
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Verification failed. QR code may be expired or already used.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
          Classroom <span className="gradient-text">Attendance Scanner</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Point your device camera at the projected lecture QR code or submit active token
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        {/* Scanner Viewport Mock */}
        <div
          style={{
            height: '240px',
            borderRadius: 'var(--radius-md)',
            border: '2px dashed rgba(99, 102, 241, 0.4)',
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '28px',
          }}
        >
          <Camera size={44} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Camera Scanner Viewport
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Dynamic QR rotating token support
          </span>
        </div>

        {statusMessage && (
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background:
                statusMessage.type === 'success'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${
                statusMessage.type === 'success'
                  ? 'rgba(16, 185, 129, 0.3)'
                  : 'rgba(244, 63, 94, 0.3)'
              }`,
              color:
                statusMessage.type === 'success'
                  ? 'var(--accent-emerald)'
                  : 'var(--accent-rose)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              fontSize: '0.9rem',
            }}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleManualSubmit}>
          <div className="form-group">
            <label className="form-label">Session ID</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. 65f123456789abcdef123456"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Scanned Dynamic Token Payload</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="Paste or auto-scan JWT QR token"
              value={qrToken}
              onChange={(e) => setQrToken(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={loading}
          >
            <QrCode size={18} />
            {loading ? 'Validating Token...' : 'Verify Attendance'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScanQrPage;
