import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MeetingPage from "./components/meetings"; // Import the MeetingPage
import VideoCall from "./components/videoCall";
import { useLogin } from "./context/loginContext"; // Corrected import
import "./index.css";

const App = () => {
  const { isAuthenticated } = useLogin(); // Access authentication state from context

  return (
    <Router>
      <Routes>
        {/* Redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/meeting"
          element={true ? <MeetingPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/videoCall/:roomId"
          element={true ? <VideoCall /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
