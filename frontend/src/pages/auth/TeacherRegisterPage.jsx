import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { authApi } from '../../api/authApi.js';
import { subjectApi } from '../../api/subjectApi.js';
import { UserPlus, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

export const TeacherRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'teacher',
    facultyId: '',
    branch: 'BCA',
    designation: 'Assistant Professor',
    teachingAssignments: [],
    phoneNumber: '',
  });
  
  const [subjects, setSubjects] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState({
    branch: 'BCA',
    section: 'A',
    academicYear: '1st Year',
    semester: '1',
    subject: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectApi.getAll();
        const subjectsData = response.data || [];
        setSubjects(subjectsData);
        if (subjectsData.length > 0) {
          setCurrentAssignment(prev => ({ ...prev, subject: subjectsData[0]._id }));
        }
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      }
    };
    fetchSubjects();
  }, []);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAddAssignment = () => {
    if (!currentAssignment.subject) return;
    setFormData(prev => ({
      ...prev,
      teachingAssignments: [...prev.teachingAssignments, { ...currentAssignment, semester: Number(currentAssignment.semester) }]
    }));
  };

  const handleRemoveAssignment = (index) => {
    setFormData(prev => ({
      ...prev,
      teachingAssignments: prev.teachingAssignments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (formData.name.trim().length < 3 || !/^[a-zA-Z\s]+$/.test(formData.name)) {
      return "Full Name must be at least 3 characters and contain only letters and spaces.";
    }
    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }
    if (!formData.facultyId || !/^[A-Za-z0-9-]+$/.test(formData.facultyId)) {
      return "Faculty ID can only contain letters, numbers, and hyphens.";
    }
    if (formData.teachingAssignments.length === 0) {
      return "Please add at least one teaching assignment.";
    }
    if (formData.phoneNumber && !/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      return "Please enter a valid 10-digit Indian phone number.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = { ...formData };
      payload.facultyId = payload.facultyId.toUpperCase();
      delete payload.confirmPassword;

      const response = await authApi.register(payload);
      login(response.data.user, response.data.token);
      
      navigate('/teacher');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', padding: '20px 0' }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Faculty Registration</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>
        Register as a teacher/faculty member
      </p>

      {error && (
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: 'var(--accent-rose)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '18px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Official College Email *</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="faculty@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Faculty ID / Employee ID *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="Ex: FAC-2023001"
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value.toUpperCase() })}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="10-digit mobile number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Department / Branch *</label>
            <select
              className="form-input"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            >
              <option value="BCA">BCA</option>
              <option value="BTech CSE">BTech CSE</option>
              <option value="BTech IT">BTech IT</option>
              <option value="BBA">BBA</option>
              <option value="MCA">MCA</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Designation *</label>
            <select
              className="form-input"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            >
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Professor">Professor</option>
              <option value="HOD">HOD</option>
              <option value="Guest Faculty">Guest Faculty</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>
            Teaching Assignments *
          </label>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {formData.teachingAssignments.map((assignment, index) => {
              const subjectObj = subjects.find(s => s._id === assignment.subject);
              return (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{subjectObj ? `${subjectObj.name} (${subjectObj.code})` : 'Unknown Subject'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {assignment.branch} • Sec {assignment.section} • {assignment.academicYear} • Sem {assignment.semester}
                    </div>
                  </div>
                  <button type="button" onClick={() => handleRemoveAssignment(index)} style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Branch</label>
                <select className="form-input" style={{ padding: '8px' }} value={currentAssignment.branch} onChange={(e) => setCurrentAssignment({ ...currentAssignment, branch: e.target.value })}>
                  <option value="BCA">BCA</option>
                  <option value="BTech CSE">BTech CSE</option>
                  <option value="BTech IT">BTech IT</option>
                  <option value="BBA">BBA</option>
                  <option value="MCA">MCA</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Section</label>
                <select className="form-input" style={{ padding: '8px' }} value={currentAssignment.section} onChange={(e) => setCurrentAssignment({ ...currentAssignment, section: e.target.value })}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Year</label>
                <select className="form-input" style={{ padding: '8px' }} value={currentAssignment.academicYear} onChange={(e) => setCurrentAssignment({ ...currentAssignment, academicYear: e.target.value })}>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Semester</label>
                <select className="form-input" style={{ padding: '8px' }} value={currentAssignment.semester} onChange={(e) => setCurrentAssignment({ ...currentAssignment, semester: e.target.value })}>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Subject</label>
              <select className="form-input" style={{ padding: '8px' }} value={currentAssignment.subject} onChange={(e) => setCurrentAssignment({ ...currentAssignment, subject: e.target.value })}>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
              </select>
            </div>

            <button type="button" onClick={handleAddAssignment} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}>
              <Plus size={16} /> Add Class Assignment
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="form-group" style={{ flex: 1, position: 'relative' }}>
            <label className="form-label">Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              className="form-input"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '32px',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Confirm Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              className="form-input"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '16px' }}
          disabled={loading}
        >
          <UserPlus size={18} />
          {loading ? 'Creating account...' : 'Register as Faculty'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.875rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Are you a student? </span>
        <Link to="/register" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 600 }}>
          Register as Student
        </Link>
      </div>

      <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '0.875rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
        <Link to="/login" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default TeacherRegisterPage;
