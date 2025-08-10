// context/SocketContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { getTokenFromLocalStorage } from "../services";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  // const [socket, setSocket] = useState(null);

  const token = getTokenFromLocalStorage();

  const socketMemo = useMemo(() => {
    const newSocket = io(
      import.meta.env.VITE_SERVER_URL || "http://localhost:3000",
      {
        auth: { token },
        transports: ["websocket"], // optional but preferred
      }
    );

    newSocket.on("connection", () => {
      console.log("Connected:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    // setSocket(newSocket);

    return newSocket;
  }, [token]);

  useEffect(() => {
    return () => {
      if (socketMemo?.connected) {
        socketMemo.disconnect();
        console.log("🛑 Socket disconnected");
      }
    };
  }, [socketMemo]);

  return (
    <SocketContext.Provider value={socketMemo}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
