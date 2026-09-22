import React, { useState } from 'react';
import { UserCheck, ShieldCheck, UserX, Search } from 'lucide-react';

export const ManageStudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const students = [
    { id: '1', name: 'Alice Walker', roll: 'CS2023001', dept: 'CSE', sem: 6, faceEnrolled: true, consent: true },
    { id: '2', name: 'Bob Vance', roll: 'CS2023002', dept: 'CSE', sem: 6, faceEnrolled: false, consent: false },
    { id: '3', name: 'Charlie Day', roll: 'CS2023003', dept: 'CSE', sem: 6, faceEnrolled: true, consent: true },
    { id: '4', name: 'Diana Prince', roll: 'CS2023004', dept: 'CSE', sem: 6, faceEnrolled: true, consent: true },
  ];

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
          Student <span className="gradient-text">Directory</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          View enrolled students, biometric verification status, and consent compliance
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '20px', maxWidth: '360px', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by student name or roll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>Roll Number</th>
                <th style={{ padding: '12px 16px' }}>Full Name</th>
                <th style={{ padding: '12px 16px' }}>Department</th>
                <th style={{ padding: '12px 16px' }}>Semester</th>
                <th style={{ padding: '12px 16px' }}>Biometric Enrollment</th>
                <th style={{ padding: '12px 16px' }}>Privacy Consent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600 }}>{s.roll}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{s.dept}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>Sem {s.sem}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {s.faceEnrolled ? (
                      <span className="badge badge-present">Enrolled</span>
                    ) : (
                      <span className="badge badge-late">Pending</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {s.consent ? (
                      <span style={{ color: 'var(--accent-emerald)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                        <ShieldCheck size={16} /> Signed
                      </span>
                    ) : (
                      <span style={{ color: 'var(--accent-rose)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                        <UserX size={16} /> Missing
                      </span>
                    )}
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

export default ManageStudentsPage;
