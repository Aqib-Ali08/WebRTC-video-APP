// src/routes.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ErrorPage from './pages/ErrorPage';

// Dashboard Layout + Pages
import DashboardLayout from './layout/DashboardLayout';
import HomePage from './pages/HomePage'; 
import MeetingListPage from './pages/MeetingListPage';
import MeetingRoomPage from './pages/MeetingRoomPage';
import ScheduleMeetingPage from './pages/ScheduleMeetingPage';
import ChatListPage from './pages/ChatListPage';
import ChatRoomPage from './pages/ChatRoomPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="meetings" element={<MeetingListPage />} />
          <Route path="meeting/:meetingId" element={<MeetingRoomPage />} />
          <Route path="schedule" element={<ScheduleMeetingPage />} />
          <Route path="messages" element={<ChatListPage />} />
          <Route path="messages/:chatId" element={<ChatRoomPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Redirect default /dashboard to /dashboard/home */}
          <Route index element={<Navigate to="home" />} />
        </Route>

        {/* Error Routes */}
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
