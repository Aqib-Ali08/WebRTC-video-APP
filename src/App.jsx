import React, { useEffect } from "react";
import "./index.css";
import AppRoutes from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import { getTokenFromLocalStorage } from "./services";
import { showToast } from "./redux/slices/appSlice";
import { useDispatch } from "react-redux";

const token = getTokenFromLocalStorage();
const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3000", {
  auth: {
    token: token,
  },
});



const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (!socket) return;

    socket.on("notify", (data) => {
      console.log(data)
      const message = data.message || "🔔 You have a new notification!";
      const type = data.type === "FRIEND_REQUEST" ? "info" : "success";

      dispatch(showToast(message, type));
    });

    return () => {
      socket.off("notify");
    };
  }, []);

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
