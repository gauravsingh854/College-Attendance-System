import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionApi } from '../../api/sessionApi.js';
import { teacherApi } from '../../api/teacherApi.js';
import { PlusCircle, QrCode } from 'lucide-react';

export const CreateSessionPage = () => {
  const [formData, setFormData] = useState({
    assignmentId: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    geofenceEnabled: false,
  });
  
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await teacherApi.getAssignedClasses();
        const classesData = res.data || [];
        setAssignedClasses(classesData);
        if (classesData.length > 0) {
          setFormData(prev => ({ ...prev, assignmentId: classesData[0]._id }));
        }
      } catch (err) {
        console.error('Could not fetch assigned classes', err);
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assignmentId) {
      setMessage('Notice: You must select an assigned class first.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await sessionApi.createSession({
        assignmentId: formData.assignmentId,
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
            <label className="form-label">Select Assigned Class</label>
            <select
              className="form-input"
              value={formData.assignmentId}
              onChange={(e) => setFormData({ ...formData, assignmentId: e.target.value })}
              required
            >
              {assignedClasses.length === 0 && <option value="">No classes assigned yet</option>}
              {assignedClasses.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.subject?.name} ({cls.branch} - Sec {cls.section}) - {cls.academicYear} Sem {cls.semester}
                </option>
              ))}
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
            disabled={loading || assignedClasses.length === 0}
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
