import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  GraduationCap,
  LayoutDashboard,
  QrCode,
  ScanFace,
  ClipboardList,
  FileSpreadsheet,
  Users,
  LogOut,
  PlusCircle,
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout, isTeacher } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    color: isActive ? '#ffffff' : 'var(--text-secondary)',
    background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
    border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.92rem',
    transition: 'var(--transition)',
  });

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '8px',
              borderRadius: '12px',
              background: 'var(--gradient-primary)',
            }}
          >
            <GraduationCap size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>SmartAttend</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isTeacher ? 'Teacher Portal' : 'Student Portal'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {isTeacher ? (
            <>
              <NavLink to="/teacher" end style={navItemStyle}>
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>
              <NavLink to="/teacher/create-session" style={navItemStyle}>
                <PlusCircle size={18} /> New Session
              </NavLink>
              <NavLink to="/teacher/reports" style={navItemStyle}>
                <FileSpreadsheet size={18} /> Reports
              </NavLink>
              <NavLink to="/teacher/students" style={navItemStyle}>
                <Users size={18} /> Students
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/student" end style={navItemStyle}>
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>
              <NavLink to="/student/scan" style={navItemStyle}>
                <QrCode size={18} /> Scan QR
              </NavLink>
              <NavLink to="/student/face-enroll" style={navItemStyle}>
                <ScanFace size={18} /> Face Enrollment
              </NavLink>
              <NavLink to="/student/attendance" style={navItemStyle}>
                <ClipboardList size={18} /> My Attendance
              </NavLink>
            </>
          )}
        </nav>

        {/* User Card & Logout */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user?.email || 'user@college.edu'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
