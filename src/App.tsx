import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminRoute, GuestRoute, ProtectedRoute } from "./components/Guards";
import { AdminLayout } from "./layouts/AdminLayout";
import { UserLayout } from "./layouts/UserLayout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { BoardEditorPage, BoardsPage, ShareAccessPage } from "./pages/user/BoardsPage";
import {
  AccountPage,
  AlertsPage,
  AppsPage,
  ChartsPage,
  ExportPage,
  HistoryPage,
  ReportsViewPage,
  SchedulePage,
  SourcesPage,
  SupportPage,
  ThemePage,
  WidgetsHubPage,
} from "./pages/user/UserModules";
import {
  AdminAccessPage,
  AdminApiPage,
  AdminBackupPage,
  AdminBoardsPage,
  AdminHome,
  AdminLogsPage,
  AdminNoticesPage,
  AdminPaymentsPage,
  AdminPlansPage,
  AdminReportsPage,
  AdminSecurityPage,
  AdminSessionsPage,
  AdminSourcesPage,
  AdminSupportPage,
  AdminUsersPage,
} from "./pages/admin/AdminModules";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<UserLayout />}>
              <Route index element={<BoardsPage />} />
              <Route path="boards/:id" element={<BoardEditorPage />} />
              <Route path="sources" element={<SourcesPage />} />
              <Route path="reports" element={<ReportsViewPage />} />
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="share" element={<ShareAccessPage />} />
              <Route path="widgets" element={<WidgetsHubPage />} />
              <Route path="theme" element={<ThemePage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="export" element={<ExportPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="apps" element={<AppsPage />} />
              <Route path="charts" element={<ChartsPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="account" element={<AccountPage />} />
            </Route>
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHome />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="access" element={<AdminAccessPage />} />
              <Route path="sources" element={<AdminSourcesPage />} />
              <Route path="boards" element={<AdminBoardsPage />} />
              <Route path="notices" element={<AdminNoticesPage />} />
              <Route path="support" element={<AdminSupportPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="security" element={<AdminSecurityPage />} />
              <Route path="api" element={<AdminApiPage />} />
              <Route path="logs" element={<AdminLogsPage kind="system" />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="plans" element={<AdminPlansPage />} />
              <Route path="sessions" element={<AdminSessionsPage />} />
              <Route path="events" element={<AdminLogsPage kind="event" />} />
              <Route path="backup" element={<AdminBackupPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
