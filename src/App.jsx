import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MeetingPage from "./components/meetings"; // Import the MeetingPage
import VideoCall from "./components/videoCall";
import { useLogin } from "./context/loginContext"; // Corrected import
import "./index.css";
import AppRoutes from "./router";
const App = () => {
 

  return (
    <AppRoutes/>
  );
};

export default App;
