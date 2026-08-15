import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore.js';
import { useUIStore } from './store/uiStore.js';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Problems from './pages/Problems.jsx';
import ProblemDetail from './pages/ProblemDetail.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Rankings from './pages/Rankings.jsx';
import Achievements from './pages/Achievements.jsx';
import Analytics from './pages/Analytics.jsx';
import Discussions from './pages/Discussions.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import ComingSoon from './pages/ComingSoon.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminProblems from './pages/admin/AdminProblems.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminFeedback from './pages/admin/AdminFeedback.jsx';

import PageLayout from './components/layout/PageLayout.jsx';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <div className="page-loading">Authenticating...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// Admin only route
function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <div className="page-loading">Authenticating...</div>;
  if (!isAuthenticated || user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}

// Guest only route
function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <div className="page-loading">Authenticating...</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Problems */}
      <Route path="/problems" element={<Problems />} />
      <Route path="/problems/:slug" element={<ProblemDetail />} />

      {/* Leaderboard & Rankings */}
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/rankings" element={<Rankings />} />

      {/* Community */}
      <Route path="/discussions" element={<Discussions />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/profile/:username" element={<Profile />} />

      {/* Personal User Routes */}
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Admin Panel */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/problems" element={<AdminRoute><AdminProblems /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/feedback" element={<AdminRoute><AdminFeedback /></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={<PageLayout><ComingSoon title="404" description="Page not found in NYC Arena" /></PageLayout>} />
    </Routes>
  );
}

export default App;
