import React, { useState } from 'react';
import { studentApi } from '../../api/studentApi.js';
import { ScanFace, Shield, CheckCircle2 } from 'lucide-react';

export const FaceEnrollmentPage = () => {
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleEnrollMock = async () => {
    if (!consentGiven) {
      alert('You must provide informed consent prior to biometric enrollment.');
      return;
    }

    setLoading(true);
    setMessage(null);

    // Mock 128-dimensional facial embedding
    const mockDescriptor = Array.from({ length: 128 }, () =>
      Number((Math.random() * 2 - 1).toFixed(4))
    );

    try {
      await studentApi.enrollFace({
        faceDescriptor: mockDescriptor,
        consentGiven: true,
      });
      setMessage('Facial biometric descriptor registered successfully!');
    } catch (err) {
      setMessage(`Notice: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
          Facial Biometric <span className="gradient-text">Enrollment</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Secure, irreversible mathematical embedding for proxy-free attendance authentication
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        {/* Biometric Privacy Card */}
        <div
          style={{
            padding: '18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Shield size={22} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                Privacy First Architecture
              </strong>
              Your raw photographic images are never stored on central servers. We extract a one-way 128-float mathematical descriptor that cannot be reverse-engineered back into a face.
            </div>
          </div>
        </div>

        {message && (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--accent-emerald)',
              fontSize: '0.875rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {/* Camera Preview Mock */}
        <div
          style={{
            height: '220px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <ScanFace size={52} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Biometric Capture Preview
          </span>
        </div>

        {/* Consent Checkbox */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
          <input
            type="checkbox"
            id="consent"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          />
          <label htmlFor="consent" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            I agree to the institutional <span style={{ color: 'var(--accent-cyan)' }}>Biometric Consent Policy</span> and authorize facial landmark extraction for lecture verification.
          </label>
        </div>

        <button
          onClick={handleEnrollMock}
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={loading || !consentGiven}
        >
          <ScanFace size={18} />
          {loading ? 'Processing Embeddings...' : 'Capture & Enroll Face'}
        </button>
      </div>
    </div>
  );
};

export default FaceEnrollmentPage;
