import React, { useState, useEffect } from 'react';
import { studentApi } from '../../api/studentApi.js';
import { Calendar, Filter } from 'lucide-react';

export const MyAttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getHistory();
      if (res?.data?.data) {
        setRecords(res.data || []);
        
        // Extract unique subjects for filter
        const uniqueSubjects = [];
        (res.data || []).forEach(r => {
          if (r.subject && !uniqueSubjects.find(s => s._id === r.subject._id)) {
            uniqueSubjects.push(r.subject);
          }
        });
        setSubjects(uniqueSubjects);
      }
    } catch (err) {
      console.warn('Could not load attendance history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = filterSubject 
    ? records.filter(r => r.subject?._id === filterSubject)
    : records;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
            My <span className="gradient-text">Attendance Ledger</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Immutable timestamped record of verified attendance entries
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--text-secondary)" />
          <select 
            className="form-input" 
            style={{ minWidth: '200px' }}
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>Date & Time</th>
                <th style={{ padding: '12px 16px' }}>Subject</th>
                <th style={{ padding: '12px 16px' }}>Verification Method</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>Loading history...</td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {new Date(item.recordedAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                      {item.subject?.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({item.subject?.code})</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        background: 'var(--bg-secondary)', 
                        fontSize: '0.8rem',
                        border: '1px solid var(--border-color)'
                      }}>
                        {item.verificationMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge badge-${item.status}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>No attendance records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyAttendancePage;
