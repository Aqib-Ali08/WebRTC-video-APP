// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useMemo } from "react";
import { getSocket } from "../config/socketClient";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketMemo = useMemo(() => getSocket(), []);
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
