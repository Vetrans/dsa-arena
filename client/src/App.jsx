import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/app/AppShell.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { LeaderboardPage } from "./pages/LeaderboardPage.jsx";
import { ContestsPage } from "./pages/ContestsPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
const privatePages = [
  [
    "/dashboard",
    "Dashboard",
    "A clear view of your streak, progress, and next challenge.",
  ],
  [
    "/problems",
    "Problems",
    "Pick a problem, work through it, and make the next solve count.",
  ],
  [
    "/problems/:slug",
    "Problem workspace",
    "Write your solution, run it, and submit when you are ready.",
  ],
  [
    "/submissions",
    "Submissions",
    "Review every attempt and improve from the result.",
  ],
  [
    "/contests/:slug",
    "Contest arena",
    "Your contest space: timer, problems, and standings.",
  ],
  [
    "/battles",
    "Battles",
    "Find an opponent and enter a fast head-to-head challenge.",
  ],
  [
    "/roadmap",
    "Learning roadmap",
    "A focused route through every core DSA topic.",
  ],
  ["/discussions", "Discussions", "Ask, explain, and learn together."],
  [
    "/solutions",
    "Solutions",
    "Community explanations and reference approaches.",
  ],
  [
    "/achievements",
    "Achievements",
    "Track XP, badges, streaks, and milestones.",
  ],
  [
    "/profile/:username",
    "Public profile",
    "Your public problem-solving story.",
  ],
  ["/settings", "Settings", "Manage your profile and preferences."],
  ["/notifications", "Notifications", "Your arena updates."],
];
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/contests" element={<ContestsPage />} />
      <Route element={<AppShell />}>
        {privatePages.map(([path, title, description]) => (
          <Route
            key={path}
            path={path}
            element={<ProductPage title={title} description={description} />}
          />
        ))}
      </Route>
      <Route
        path="/rankings"
        element={<Navigate to="/leaderboard" replace />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
