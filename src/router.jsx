// src/routes.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ErrorPage from "./pages/ErrorPage";

// Dashboard Layout + Pages
import DashboardLayout from "./layout/DashboardLayout";
import HomePage from "./pages/HomePage";
import MeetingListPage from "./pages/MeetingListPage";
import MeetingRoomPage from "./pages/MeetingRoomPage";
import ScheduleMeetingPage from "./pages/ScheduleMeetingPage";
import ChatListPage from "./pages/ChatListPage";
import ChatRoomPage from "./pages/ChatRoomPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { selectAuthData } from "./redux/slices/authSlice";
import { useSelector } from "react-redux";
import ProtectedRoute from "./layout/ProtectedRoute";

const AppRoutes = () => {
  const { token, expiresAt } = useSelector(selectAuthData);

  const isTokenValid =
    token && expiresAt && new Date().getTime() < new Date(expiresAt).getTime();

  return (
    <Router>
      <Routes>
   
        <Route
          path="/"
          element={
            isTokenValid ? <Navigate to="/dashboard" /> : <LandingPage />
          }
        />
        <Route
          path="/login"
          element={isTokenValid ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={
            isTokenValid ? <Navigate to="/dashboard" /> : <RegisterPage />
          }
        />

        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<HomePage />} />
            <Route path="meetings" element={<MeetingListPage />} />
            <Route path="meeting/:meetingId" element={<MeetingRoomPage />} />
            <Route path="schedule" element={<ScheduleMeetingPage />} />
            <Route path="messages" element={<ChatListPage />} />
            <Route path="messages/:chatId" element={<ChatRoomPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

      
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
