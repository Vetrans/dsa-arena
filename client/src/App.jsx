import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/app/AppShell.jsx";
import { PageSkeleton } from "./components/ui/PageSkeleton.jsx";
import { ProtectedRoute, AdminRoute } from "./components/auth/RouteGuards.jsx";

// Public Core Entry Pages (Loaded eagerly for rapid FCP)
import { HomePage } from "./pages/HomePage.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";

// Dynamically Code-Split Heavy Route Components (React.lazy)
const LeaderboardPage = lazy(() =>
  import("./pages/LeaderboardPage.jsx").then((m) => ({ default: m.LeaderboardPage }))
);
const ContestsPage = lazy(() =>
  import("./pages/ContestsPage.jsx").then((m) => ({ default: m.ContestsPage }))
);
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage.jsx").then((m) => ({ default: m.DashboardPage }))
);
const ProblemsExplorerPage = lazy(() =>
  import("./pages/ProblemsExplorerPage.jsx").then((m) => ({
    default: m.ProblemsExplorerPage
  }))
);
const ProblemWorkspacePage = lazy(() =>
  import("./pages/ProblemWorkspacePage.jsx").then((m) => ({
    default: m.ProblemWorkspacePage
  }))
);
const BattleArenaPage = lazy(() =>
  import("./pages/BattleArenaPage.jsx").then((m) => ({ default: m.BattleArenaPage }))
);
const ContestArenaPage = lazy(() =>
  import("./pages/ContestArenaPage.jsx").then((m) => ({
    default: m.ContestArenaPage
  }))
);
const RoadmapPage = lazy(() =>
  import("./pages/RoadmapPage.jsx").then((m) => ({ default: m.RoadmapPage }))
);
const SubmissionsPage = lazy(() =>
  import("./pages/SubmissionsPage.jsx").then((m) => ({
    default: m.SubmissionsPage
  }))
);
const AchievementsPage = lazy(() =>
  import("./pages/AchievementsPage.jsx").then((m) => ({
    default: m.AchievementsPage
  }))
);
const ProfilePage = lazy(() =>
  import("./pages/ProfilePage.jsx").then((m) => ({ default: m.ProfilePage }))
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage.jsx").then((m) => ({ default: m.SettingsPage }))
);
const ProductPage = lazy(() =>
  import("./pages/ProductPage.jsx").then((m) => ({ default: m.ProductPage }))
);

// Admin Portal Pages (Lazy Chunk)
const AdminLayout = lazy(() =>
  import("./pages/admin/AdminLayout.jsx").then((m) => ({ default: m.AdminLayout }))
);
const AdminDashboard = lazy(() =>
  import("./pages/admin/AdminDashboard.jsx").then((m) => ({
    default: m.AdminDashboard
  }))
);
const AdminContests = lazy(() =>
  import("./pages/admin/AdminContests.jsx").then((m) => ({
    default: m.AdminContests
  }))
);
const AdminProblems = lazy(() =>
  import("./pages/admin/AdminProblems.jsx").then((m) => ({
    default: m.AdminProblems
  }))
);
const AdminUsers = lazy(() =>
  import("./pages/admin/AdminUsers.jsx").then((m) => ({ default: m.AdminUsers }))
);
const AdminFeedback = lazy(() =>
  import("./pages/admin/AdminFeedback.jsx").then((m) => ({
    default: m.AdminFeedback
  }))
);

const remainingProductPages = [
  ["/discussions", "Discussions", "Ask, explain, and learn together."],
  ["/solutions", "Solutions", "Community explanations and reference approaches."],
  ["/notifications", "Notifications", "Your arena updates."]
];

export default function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/contests" element={<ContestsPage />} />

        {/* Main Internal Arena Application (Protected Shell) */}
        <Route element={<AppShell />}>
          {/* Publicly Browseable Problems Explorer */}
          <Route path="/problems" element={<ProblemsExplorerPage />} />
          <Route path="/problems/:slug" element={<ProblemWorkspacePage />} />

          {/* Member-Only Authenticated Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/battles"
            element={
              <ProtectedRoute>
                <BattleArenaPage />
              </ProtectedRoute>
            }
          />
          <Route path="/contests/:slug" element={<ContestArenaPage />} />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <RoadmapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submissions"
            element={
              <ProtectedRoute>
                <SubmissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <AchievementsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Auxiliary Pages */}
          {remainingProductPages.map(([path, title, description]) => (
            <Route
              key={path}
              path={path}
              element={<ProductPage title={title} description={description} />}
            />
          ))}
        </Route>

        {/* Admin Super-Console Management Portal (Protected by AdminRoute) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="contests" element={<AdminContests />} />
          <Route path="problems" element={<AdminProblems />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="feedback" element={<AdminFeedback />} />
        </Route>

        <Route
          path="/rankings"
          element={<Navigate to="/leaderboard" replace />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
