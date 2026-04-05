import { createContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import config from "../services/config";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();

  const socket = useMemo(() => {
    if (user) {
      const newSocket = io(config.baseURL);
      console.log("Socket created and joining room:", user.id);
      newSocket.emit("join", user.id);
      return newSocket;
    }
    return null;
  }, [user]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
