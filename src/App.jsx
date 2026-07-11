import React, { useEffect, useMemo } from "react";
import "./index.css";
import AppRoutes from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import { getTokenFromLocalStorage } from "./services";
import { showToast } from "./redux/slices/appSlice";
import { useDispatch } from "react-redux";
import { SocketProvider, useSocket } from "./context/socketContext";
import MainApp from "./MainApp";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

// const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3000", {
//   auth: {
//     token: token,
//   },
// });

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <MainApp />
          <ToastContainer
            position="bottom-left"
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
        </SocketProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
