import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { authApi } from '../../api/authApi.js';
import { subjectApi } from '../../api/subjectApi.js';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { getSemestersForBranch } from '../../utils/config.js';

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
    phoneNumber: '',
    section: 'A',
    semester: '1',
    subject: '',
  });
  
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [semesterResetMessage, setSemesterResetMessage] = useState('');
  
  const maxSemesters = getSemestersForBranch(formData.branch);
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (parseInt(formData.semester) > maxSemesters) {
      setFormData(prev => ({ ...prev, semester: '1' }));
      setSemesterResetMessage('Semester reset');
      setTimeout(() => setSemesterResetMessage(''), 3000);
    }
  }, [formData.branch, maxSemesters]);

  useEffect(() => {
    const fetchSubjects = async () => {
      setSubjectsLoading(true);
      try {
        const response = await subjectApi.getAll({ branch: formData.branch, semester: formData.semester });
        const subjectsData = response.data || [];
        setSubjects(subjectsData);
        if (subjectsData.length > 0) {
          setFormData(prev => ({ ...prev, subject: subjectsData[0]._id }));
        } else {
          setFormData(prev => ({ ...prev, subject: '' }));
        }
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      } finally {
        setSubjectsLoading(false);
      }
    };
    if (formData.branch && formData.semester && parseInt(formData.semester) <= maxSemesters) {
      fetchSubjects();
    }
  }, [formData.branch, formData.semester, maxSemesters]);
  
  const { login } = useAuth();
  const navigate = useNavigate();

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
    if (!formData.subject) {
      return "Please select a subject for the teaching assignment.";
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
      
      payload.teachingAssignments = [{
        branch: payload.branch,
        section: payload.section,
        semester: Number(payload.semester),
        subject: payload.subject
      }];
      
      delete payload.section;
      delete payload.semester;
      delete payload.subject;

      const response = await authApi.register(payload);
      login(response.data.user, response.data.token);
      
      navigate('/teacher');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && data.errors.length > 0) {
        setError(data.errors.join(', '));
      } else {
        setError(data?.message || err.message || 'Registration failed. Please try again.');
      }
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
            Class Assignment *
          </label>
          <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Section</label>
                <select className="form-input" style={{ padding: '8px' }} value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Semester</label>
                  {semesterResetMessage && <span style={{ fontSize: '0.7rem', color: 'var(--accent-amber)' }}>{semesterResetMessage}</span>}
                </div>
                <select className="form-input" style={{ padding: '8px' }} value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })}>
                  {Array.from({ length: maxSemesters }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Subject</label>
              {subjectsLoading ? (
                <div style={{ padding: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading subjects...</div>
              ) : subjects.length > 0 ? (
                <select className="form-input" style={{ padding: '8px' }} value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
                  <optgroup label="Theory">
                    {subjects.filter(s => s.type === 'theory').map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Practical">
                    {subjects.filter(s => s.type === 'practical').map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                    ))}
                  </optgroup>
                </select>
              ) : (
                <div style={{ padding: '8px', color: 'var(--accent-amber)', fontSize: '0.85rem' }}>No subjects configured for this branch/semester</div>
              )}
            </div>
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
