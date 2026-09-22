import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Layouts
import AuthLayout from '../layouts/AuthLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

// Pages
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import TeacherDashboard from '../pages/teacher/TeacherDashboard.jsx';
import CreateSessionPage from '../pages/teacher/CreateSessionPage.jsx';
import AttendanceReportPage from '../pages/teacher/AttendanceReportPage.jsx';
import ManageStudentsPage from '../pages/teacher/ManageStudentsPage.jsx';
import StudentDashboard from '../pages/student/StudentDashboard.jsx';
import ScanQrPage from '../pages/student/ScanQrPage.jsx';
import FaceEnrollmentPage from '../pages/student/FaceEnrollmentPage.jsx';
import MyAttendancePage from '../pages/student/MyAttendancePage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

// Route Guards
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'teacher' ? '/teacher' : '/student'} replace />;
  }

  return children;
};

export const AppRoutes = () => {
  const { isAuthenticated, isTeacher } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={isTeacher ? '/teacher' : '/student'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Auth Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Teacher Protected Routes */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="create-session" element={<CreateSessionPage />} />
        <Route path="reports" element={<AttendanceReportPage />} />
        <Route path="students" element={<ManageStudentsPage />} />
      </Route>

      {/* Student Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="scan" element={<ScanQrPage />} />
        <Route path="face-enroll" element={<FaceEnrollmentPage />} />
        <Route path="attendance" element={<MyAttendancePage />} />
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
