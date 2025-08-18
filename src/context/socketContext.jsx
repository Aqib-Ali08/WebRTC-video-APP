import { createContext, useContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { getTokenFromLocalStorage } from "../services";
import { useDispatch } from "react-redux";
import { registerPresenceSocketHandlers } from "../sockets/chats.socket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  const socketMemo = useMemo(() => {
    const socket = io(
      import.meta.env.VITE_SERVER_URL || "http://localhost:3000",
      {
        auth: { token: getTokenFromLocalStorage() },
        transports: ["websocket"],
        autoConnect: false, // don't connect until explicitly told
        reconnection: true, // allow auto reconnection
        reconnectionAttempts: Infinity, // keep trying forever
        reconnectionDelay: 2000, // start retry every 2s
        reconnectionDelayMax: 10000, // max retry delay 10s
      }
    );

    return socket;
  }, []);

  useEffect(() => {
    const socket = socketMemo;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);

      // Handle manual reconnect if needed
      if (reason === "io server disconnect") {
        // Server kicked us (maybe token expired) — try reconnect
        socket.auth = { token: getTokenFromLocalStorage() };
        socket.connect();
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });
    const cleanupChatPresence = registerPresenceSocketHandlers(socket, dispatch);
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      cleanupChatPresence()
    };
  }, [socketMemo]);

  return (
    <SocketContext.Provider value={socketMemo}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
