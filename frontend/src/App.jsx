import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import MarkAttendancePage from "./pages/MarkAttendancePage";
import ReportsPage from "./pages/ReportsPage";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/mark-attendance" element={<MarkAttendancePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile/:userId" element={<UserProfilePage />} />
        <Route path="/settings" element={<div className="rounded-2xl bg-white p-8 shadow-card">Settings placeholder</div>} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;

