import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/app/AppShell.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { LeaderboardPage } from "./pages/LeaderboardPage.jsx";
import { ContestsPage } from "./pages/ContestsPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";

// Dedicated Arena Core Pages
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { ProblemsExplorerPage } from "./pages/ProblemsExplorerPage.jsx";
import { ProblemWorkspacePage } from "./pages/ProblemWorkspacePage.jsx";
import { BattleArenaPage } from "./pages/BattleArenaPage.jsx";
import { ContestArenaPage } from "./pages/ContestArenaPage.jsx";
import { RoadmapPage } from "./pages/RoadmapPage.jsx";
import { SubmissionsPage } from "./pages/SubmissionsPage.jsx";
import { AchievementsPage } from "./pages/AchievementsPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";

// Admin Super-Console Pages
import { AdminLayout } from "./pages/admin/AdminLayout.jsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";
import { AdminContests } from "./pages/admin/AdminContests.jsx";
import { AdminProblems } from "./pages/admin/AdminProblems.jsx";
import { AdminUsers } from "./pages/admin/AdminUsers.jsx";
import { AdminFeedback } from "./pages/admin/AdminFeedback.jsx";

const remainingProductPages = [
  ["/discussions", "Discussions", "Ask, explain, and learn together."],
  ["/solutions", "Solutions", "Community explanations and reference approaches."],
  ["/notifications", "Notifications", "Your arena updates."]
];

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/contests" element={<ContestsPage />} />

      {/* Main Internal Arena Application (Protected Shell) */}
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/problems" element={<ProblemsExplorerPage />} />
        <Route path="/problems/:slug" element={<ProblemWorkspacePage />} />
        <Route path="/battles" element={<BattleArenaPage />} />
        <Route path="/contests/:slug" element={<ContestArenaPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/submissions" element={<SubmissionsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Auxiliary Pages */}
        {remainingProductPages.map(([path, title, description]) => (
          <Route
            key={path}
            path={path}
            element={<ProductPage title={title} description={description} />}
          />
        ))}
      </Route>

      {/* Admin Super-Console Management Portal */}
      <Route path="/admin" element={<AdminLayout />}>
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
  );
}
