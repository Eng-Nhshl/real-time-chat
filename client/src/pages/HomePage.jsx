import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import SideBar from "../components/SideBar";
import ChatContainer from "../components/ChatContainer";
import RightSideBar from "../components/RightSideBar";
import messageService from "../services/messageService";
import assets from "../assets/assets";

const HomePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    if (user) {
      setUnreadCounts((prev) => ({
        ...prev,
        [user.id]: 0,
      }));
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        const data = await messageService.getMessages(selectedUser.id);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (message) => {
        if (
          message.senderId === selectedUser?.id ||
          message.receiverId === selectedUser?.id
        ) {
          setMessages((prev) => [...prev, message]);
        } else {
          // Increment unread count for the sender
          setUnreadCounts((prev) => ({
            ...prev,
            [message.senderId]: (prev[message.senderId] || 0) + 1,
          }));
          // Show notification
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("New message", {
              body: message.text || "Image",
              icon: assets.logo_icon,
            });
          }
        }
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [socket, selectedUser]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-x1 border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${selectedUser ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]" : "md:grid-cols-2"}`}
      >
        <SideBar
          selectedUser={selectedUser}
          setSelectedUser={handleSelectUser}
          unreadCounts={unreadCounts}
        />
        <ChatContainer
          selectedUser={selectedUser}
          setSelectedUser={handleSelectUser}
          messages={messages}
          setMessages={setMessages}
        />
        <RightSideBar
          selectedUser={selectedUser}
          setSelectedUser={handleSelectUser}
        />
      </div>
    </div>
  );
};

export default HomePage;
