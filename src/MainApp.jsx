import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "./context/socketContext";
import { getTokenFromLocalStorage } from "./services";
import { showToast } from "./redux/slices/appSlice";
import AppRoutes from "./router";

const MainApp = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!socket) return;

    if (isAuthenticated && !socket.connected) {
      socket.auth = { token: getTokenFromLocalStorage() };
      socket.connect();
    } else if (!isAuthenticated && socket.connected) {
      socket.disconnect();
    }
  }, [isAuthenticated, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("notify", (data) => {
      const message = data.message || "🔔 You have a new notification!";
      const type = data.type || "info";
      dispatch(showToast(message, type));
    });

    return () => {
      socket.off("notify");
    };
  }, [socket, dispatch]);

  return <AppRoutes />;
};

export default MainApp;
