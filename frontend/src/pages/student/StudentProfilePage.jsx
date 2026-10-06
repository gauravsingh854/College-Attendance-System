import React, { useState, useEffect } from 'react';
import { studentApi } from '../../api/studentApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { User, Shield, ScanFace } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await studentApi.getProfile();
      // Ensure we access the correct data property
      setProfile(res.data);
    } catch (err) {
      console.warn('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    const oldPassword = prompt("Enter your current password:");
    if (!oldPassword) return;
    const newPassword = prompt("Enter your new password:");
    if (!newPassword || newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    try {
      const response = await studentApi.changePassword({ oldPassword, newPassword });
      if (response.success) {
        alert("Password changed successfully!");
      } else {
        alert("Failed to change password: " + (response.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error changing password: " + (err.response?.data?.message || err.message || "Please try again later."));
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading profile...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
          Profile & <span className="gradient-text">Security</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Manage your personal details and biometric security settings
        </p>
      </div>

      <div className="card-grid">
        {/* Personal Details */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '8px' }}>
              <User size={20} color="var(--accent-primary)" />
            </div>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Personal Details</h2>
          </div>
          
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Full Name</label>
              <div style={{ fontWeight: 600 }}>{user?.name}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>College Email</label>
              <div style={{ fontWeight: 600, wordBreak: 'break-all' }}>{user?.email}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Roll Number</label>
              <div style={{ fontWeight: 600 }}>{profile?.rollNumber || 'N/A'}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Branch</label>
              <div style={{ fontWeight: 600 }}>{profile?.branch || 'N/A'}</div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Academic Year & Sem</label>
              <div style={{ fontWeight: 600 }}>{profile?.academicYear || 'N/A'} / Sem {profile?.semester || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Biometrics */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '8px' }}>
              <ScanFace size={20} color="var(--accent-cyan)" />
            </div>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Biometric Security</h2>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status: </span>
            {profile?.isFaceEnrolled ? (
              <span style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>Enrolled</span>
            ) : (
              <span style={{ fontWeight: 600, color: 'var(--accent-rose)' }}>Pending Enrollment</span>
            )}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
            <strong>Privacy Note:</strong> Your facial descriptor is stored as an irreversible mathematical representation. We do not store raw images of your face. It is used strictly for on-device attendance verification.
          </p>

          <Link to="/student/face-enroll" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            {profile?.isFaceEnrolled ? 'Re-enroll Face' : 'Enroll Face Now'}
          </Link>
        </div>

        {/* Security */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', background: 'rgba(244, 63, 94, 0.15)', borderRadius: '8px' }}>
              <Shield size={20} color="var(--accent-rose)" />
            </div>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Security</h2>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Keep your account secure by using a strong password.
          </p>

          <button className="btn btn-secondary" onClick={handlePasswordChange}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
