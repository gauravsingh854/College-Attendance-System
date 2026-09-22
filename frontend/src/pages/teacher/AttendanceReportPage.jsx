import React, { useState } from 'react';
import { Download, Filter, FileSpreadsheet } from 'lucide-react';

export const AttendanceReportPage = () => {
  const [selectedSubject, setSelectedSubject] = useState('CS401');

  const mockRecords = [
    { roll: 'CS2023001', name: 'Alice Walker', department: 'CSE', date: '2026-09-22', method: 'Face Verified', status: 'present' },
    { roll: 'CS2023002', name: 'Bob Vance', department: 'CSE', date: '2026-09-22', method: 'Dynamic QR', status: 'present' },
    { roll: 'CS2023003', name: 'Charlie Day', department: 'CSE', date: '2026-09-22', method: 'Face Verified', status: 'late' },
    { roll: 'CS2023004', name: 'Diana Prince', department: 'CSE', date: '2026-09-22', method: 'None', status: 'absent' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
            Attendance <span className="gradient-text">Reports</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Audit verification records, filter by course/date, and export CSV files
          </p>
        </div>

        <button className="btn btn-secondary">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '220px' }}>
            <label className="form-label">Subject</label>
            <select
              className="form-input"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="CS401">CS401 - Database Systems</option>
              <option value="CS402">CS402 - Artificial Intelligence</option>
            </select>
          </div>
          <div style={{ flex: '1', minWidth: '220px' }}>
            <label className="form-label">Date Filter</label>
            <input type="date" className="form-input" defaultValue="2026-09-22" />
          </div>
        </div>

        {/* Attendance Records Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>Roll No</th>
                <th style={{ padding: '12px 16px' }}>Student Name</th>
                <th style={{ padding: '12px 16px' }}>Dept</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Verification Method</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockRecords.map((rec) => (
                <tr key={rec.roll} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600 }}>{rec.roll}</td>
                  <td style={{ padding: '14px 16px' }}>{rec.name}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{rec.department}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{rec.date}</td>
                  <td style={{ padding: '14px 16px' }}>{rec.method}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${rec.status === 'present' ? 'badge-present' : rec.status === 'late' ? 'badge-late' : 'badge-absent'}`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportPage;
