import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, UserCheck, UserX, X } from 'lucide-react';
import { teacherApi } from '../../api/teacherApi.js';

export const ManageStudentsPage = () => {
  const { assignmentId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = assignmentId
          ? await teacherApi.getClassStudents(assignmentId)
          : await teacherApi.getAllStudents();
        if (res?.data) {
          setStudents(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch students:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
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
                      <button 
                        onClick={() => setSelectedStudent(s)}
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Profile Modal */}
      {selectedStudent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ 
            width: '100%', maxWidth: '400px', padding: '24px', position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedStudent(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>Student Profile</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full Name</div>
                <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{selectedStudent.fullName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Roll Number</div>
                <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--accent-blue)' }}>{selectedStudent.rollNumber}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email Address</div>
                <div>{selectedStudent.email}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Branch & Section</div>
                  <div>{selectedStudent.branch} - Sec {selectedStudent.section}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Academic Year</div>
                  <div>{selectedStudent.academicYear} / Sem {selectedStudent.semester}</div>
                </div>
              </div>
              <div style={{ marginTop: '8px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>Overall Attendance</span>
                <span className="badge badge-present" style={{ fontSize: '1rem', padding: '4px 10px' }}>{selectedStudent.attendancePercentage}%</span>
              </div>
            </div>
            
            <button 
              className="btn btn-primary" 
              onClick={() => setSelectedStudent(null)}
              style={{ width: '100%', marginTop: '24px' }}
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudentsPage;
