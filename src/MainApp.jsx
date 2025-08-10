// MainApp.jsx
import { useEffect } from "react";
import AppRoutes from "./router";
import { useDispatch } from "react-redux";
import { useSocket } from "./context/socketContext";
import { showToast } from "./redux/slices/appSlice";

const MainApp = () => {
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket) console.log("Socket is connected:", socket.id);

    socket.on("notify", (data) => {
      console.log(data);
      const message = data.message || "🔔 You have a new notification!";
      const type = data.type || "info";

      dispatch(showToast(message, type));
    });

    // Optional cleanup
    return () => {
      socket.off("notify");
    };
  }, [socket]);

  return <AppRoutes />;
};

export default MainApp;
