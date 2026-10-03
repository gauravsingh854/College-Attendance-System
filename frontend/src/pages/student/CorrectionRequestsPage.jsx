import React, { useState, useEffect } from 'react';
import { studentApi } from '../../api/studentApi.js';
import { FileSpreadsheet, PlusCircle, AlertCircle } from 'lucide-react';

export const CorrectionRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ session: '', reason: 'QR Issue', note: '' });
  
  // To populate the session dropdown, we can reuse today's active classes or recent classes.
  // For simplicity in this UI, we'll assume the student knows the session ID or we fetch recent sessions.
  // In a full implementation, you'd fetch the student's recent absences to populate this dropdown.
  // Here we'll just show a generic input for session ID for demo purposes.

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getCorrections();
      setRequests(res.data.data);
    } catch (err) {
      setError('Failed to load correction requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentApi.createCorrection(formData);
      setShowModal(false);
      setFormData({ session: '', reason: 'QR Issue', note: '' });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit request');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
            Attendance <span className="gradient-text">Corrections</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Request manual attendance correction for technical issues
          </p>
        </div>
        
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <PlusCircle size={18} /> New Request
        </button>
      </div>

      {error && <div style={{ color: 'var(--accent-rose)', marginBottom: '16px' }}>{error}</div>}

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>Date Submitted</th>
                <th style={{ padding: '12px 16px' }}>Session / Subject</th>
                <th style={{ padding: '12px 16px' }}>Reason</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>Loading requests...</td>
                </tr>
              ) : requests.length > 0 ? (
                requests.map((req) => (
                  <tr key={req._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                      {req.session?.subject?.name || 'Unknown Session'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>{req.reason}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${req.status === 'Approved' ? 'badge-present' : req.status === 'Rejected' ? 'badge-absent' : 'badge-late'}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>No correction requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ padding: '32px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>New Correction Request</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Session ID</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter Session ID" 
                  value={formData.session}
                  onChange={e => setFormData({...formData, session: e.target.value})}
                  required
                />
                <small style={{ color: 'var(--text-muted)' }}>Get this from your teacher</small>
              </div>
              <div className="form-group">
                <label className="form-label">Issue Reason</label>
                <select 
                  className="form-input" 
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  required
                >
                  <option value="QR Issue">QR Issue</option>
                  <option value="Camera Issue">Camera Issue</option>
                  <option value="Face Issue">Face Verification Failed</option>
                  <option value="Other">Other Technical Issue</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Note (Optional)</label>
                <textarea 
                  className="form-input" 
                  rows="3"
                  value={formData.note}
                  onChange={e => setFormData({...formData, note: e.target.value})}
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrectionRequestsPage;
