import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { SkillsPage } from './pages/SkillsPage';
import { SkillDetailPage } from './pages/SkillDetailPage';
import { VoiceArenaPage } from './pages/VoiceArenaPage';
import { MissionPage } from './pages/MissionPage';
import { MissionsPage } from './pages/MissionsPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { ProgressPage } from './pages/ProgressPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/skills"
        element={
          <PrivateRoute>
            <SkillsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/skills/:skillId"
        element={
          <PrivateRoute>
            <SkillDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/voice-arena"
        element={
          <PrivateRoute>
            <VoiceArenaPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/mission/:missionId"
        element={
          <PrivateRoute>
            <MissionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/missions"
        element={
          <PrivateRoute>
            <MissionsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/assessment/:assessmentId"
        element={
          <PrivateRoute>
            <AssessmentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/assessments"
        element={
          <PrivateRoute>
            <AssessmentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <PrivateRoute>
            <ProgressPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/certificates"
        element={
          <PrivateRoute>
            <CertificatesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminDashboardPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
