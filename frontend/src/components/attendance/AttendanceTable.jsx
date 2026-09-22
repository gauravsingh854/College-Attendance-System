import React from 'react';

export const AttendanceTable = ({ records = [] }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '12px 16px' }}>Date</th>
            <th style={{ padding: '12px 16px' }}>Subject</th>
            <th style={{ padding: '12px 16px' }}>Method</th>
            <th style={{ padding: '12px 16px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={r._id || i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                {r.date || new Date().toLocaleDateString()}
              </td>
              <td style={{ padding: '14px 16px', fontWeight: 600 }}>{r.subjectName || 'Course'}</td>
              <td style={{ padding: '14px 16px' }}>{r.verificationMethod || 'QR Code'}</td>
              <td style={{ padding: '14px 16px' }}>
                <span className={`badge ${r.status === 'present' ? 'badge-present' : 'badge-late'}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
