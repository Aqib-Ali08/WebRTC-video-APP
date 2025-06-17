import React from "react";
import "./index.css";
import AppRoutes from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import { getTokenFromLocalStorage } from "./services";

const token = getTokenFromLocalStorage();
const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3000", {
  auth: {
    token: token,
  },
});

const App = () => {
  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default App;
