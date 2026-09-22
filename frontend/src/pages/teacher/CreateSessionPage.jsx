import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionApi } from '../../api/sessionApi.js';
import { PlusCircle, QrCode } from 'lucide-react';

export const CreateSessionPage = () => {
  const [formData, setFormData] = useState({
    subjectId: '65f123456789abcdef123456', // Mock / starter Subject ID
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    geofenceEnabled: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await sessionApi.createSession({
        subjectId: formData.subjectId,
        startTime: new Date(formData.startTime),
        endTime: new Date(formData.endTime),
        geofence: { enabled: formData.geofenceEnabled },
      });
      setMessage('Attendance session initiated successfully!');
      setTimeout(() => navigate('/teacher'), 1200);
    } catch (err) {
      setMessage(`Notice: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
          Create <span className="gradient-text">Attendance Session</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Initialize dynamic QR code generation with optional facial verification and time limits
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        {message && (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              marginBottom: '20px',
              fontSize: '0.875rem',
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject / Course</label>
            <select
              className="form-input"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            >
              <option value="65f123456789abcdef123456">CS401 - Advanced Database Management Systems</option>
              <option value="65f123456789abcdef123457">CS402 - Artificial Intelligence & Computer Vision</option>
              <option value="65f123456789abcdef123458">CS403 - Distributed Systems & Cloud Computing</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Session Start</label>
              <input
                type="datetime-local"
                required
                className="form-input"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Session End</label>
              <input
                type="datetime-local"
                required
                className="form-input"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Dynamic QR Rotation</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Refreshes every 30 seconds to prevent proxy attendance / photo sharing
                </div>
              </div>
              <span className="badge badge-present">Enabled</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            <QrCode size={18} />
            {loading ? 'Initializing Session...' : 'Generate Dynamic QR Session'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionPage;
