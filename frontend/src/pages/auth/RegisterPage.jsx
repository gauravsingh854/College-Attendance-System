import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { authApi } from '../../api/authApi.js';
import { subjectApi } from '../../api/subjectApi.js';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { getSemestersForBranch } from '../../utils/config.js';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    rollNumber: '',
    branch: 'BCA',
    section: 'A',
    semester: '1',
  });
  const [subjects, setSubjects] = useState([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const maxSemesters = getSemestersForBranch(formData.branch);
  const [semesterResetMessage, setSemesterResetMessage] = useState('');
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  useEffect(() => {
    if (parseInt(formData.semester) > maxSemesters) {
      setFormData(prev => ({ ...prev, semester: '1' }));
      setSemesterResetMessage('Semester reset — please reselect');
      setTimeout(() => setSemesterResetMessage(''), 3000);
    }
  }, [formData.branch, maxSemesters]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (formData.role !== 'student') return;
      setSubjectsLoading(true);
      try {
        const response = await subjectApi.getAll({ branch: formData.branch, semester: formData.semester });
        setSubjects(response.data || []);
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      } finally {
        setSubjectsLoading(false);
      }
    };
    if (formData.branch && formData.semester && parseInt(formData.semester) <= maxSemesters) {
      fetchSubjects();
    }
  }, [formData.branch, formData.semester, formData.role, maxSemesters]);

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
    if (formData.role === 'student') {
      if (!formData.rollNumber || !/^[A-Za-z0-9-]+$/.test(formData.rollNumber)) {
        return "Roll Number can only contain letters, numbers, and hyphens.";
      }
      if (!consentGiven) {
        return "You must consent to facial recognition to register as a student.";
      }
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
      if (payload.role !== 'student') {
        delete payload.rollNumber;
        delete payload.branch;
        delete payload.section;
        delete payload.semester;
      } else {
        payload.rollNumber = payload.rollNumber.toUpperCase();
      }
      delete payload.confirmPassword;

      const response = await authApi.register(payload);
      login(response.data.user, response.data.token);
      
      if (response.data.user.role === 'teacher' || response.data.user.role === 'admin') {
        navigate('/teacher');
      } else {
        navigate('/student/face-enroll');
      }
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
    <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Create Account</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>
        Register as a student or faculty member
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
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            required
            className="form-input"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">College Email</label>
          <input
            type="email"
            required
            className="form-input"
            placeholder="john.doe@college.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {formData.role === 'student' && (
          <>
            <div className="form-group">
              <label className="form-label">College Roll Number</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Ex: CS2023001"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Branch / Department</label>
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
                <label className="form-label">Section</label>
                <select
                  className="form-input"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Semester</label>
                {semesterResetMessage && <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)' }}>{semesterResetMessage}</span>}
              </div>
              <select
                className="form-input"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              >
                {Array.from({ length: maxSemesters }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Your subjects for this semester</label>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minHeight: '60px' }}>
                {subjectsLoading ? (
                  <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Loading subjects...</span>
                ) : subjects.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {subjects.some(s => s.type === 'theory') && (
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Theory Subjects:</strong>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {subjects.filter(s => s.type === 'theory').map(sub => (
                            <span key={sub._id} style={{ display: 'inline-block', fontSize: '0.85rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                              {sub.name} ({sub.code})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {subjects.some(s => s.type === 'practical') && (
                      <div>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Practical Subjects:</strong>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {subjects.filter(s => s.type === 'practical').map(sub => (
                            <span key={sub._id} style={{ display: 'inline-block', fontSize: '0.85rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                              {sub.name} ({sub.code})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <span style={{fontSize: '0.85rem', color: 'var(--accent-amber)'}}>No subjects configured for this branch/semester yet — contact admin</span>
                )}
              </div>
            </div>
          </>
        )}

        <div className="form-group" style={{ position: 'relative' }}>
          <label className="form-label">Password</label>
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

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            required
            className="form-input"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>

        {formData.role === 'student' && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px' }}>
            <input
              type="checkbox"
              id="consent"
              required
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)', cursor: 'pointer', marginTop: '2px' }}
            />
            <label htmlFor="consent" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: '1.4' }}>
              I consent to the use of my face data only for college attendance verification.
            </label>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '8px' }}
          disabled={loading || (formData.role === 'student' && !consentGiven)}
        >
          <UserPlus size={18} />
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.875rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Are you a teacher? </span>
        <Link to="/register/teacher" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 600 }}>
          Register as Faculty
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

export default RegisterPage;
