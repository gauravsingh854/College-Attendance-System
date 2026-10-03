import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, UserCheck, UserX } from 'lucide-react';
import { teacherApi } from '../../api/teacherApi.js';

export const ManageStudentsPage = () => {
  const { assignmentId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await teacherApi.getClassStudents(assignmentId);
        if (res?.data) {
          setStudents(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch students:', err);
      } finally {
        setLoading(false);
      }
    };
    if (assignmentId) fetchStudents();
  }, [assignmentId]);

  const filtered = students.filter(
    (s) =>
      s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <Link to="/teacher" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '12px', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
          Class <span className="gradient-text">Roster</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          View students enrolled in this specific class assignment
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
          <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', right: '12px', top: '12px' }} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>Roll Number</th>
                <th style={{ padding: '12px 16px' }}>Full Name</th>
                <th style={{ padding: '12px 16px' }}>Branch</th>
                <th style={{ padding: '12px 16px' }}>Section</th>
                <th style={{ padding: '12px 16px' }}>Attendance</th>
                <th style={{ padding: '12px 16px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {searchTerm ? 'No students found matching your search.' : 'No students are enrolled in this class yet.'}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600 }}>{s.rollNumber}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{s.fullName || 'Unknown'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{s.branch}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{s.section}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-present">{s.attendancePercentage}%</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>View Profile</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStudentsPage;
