import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ChatHeader from "../components/ChatHeader";
import JoinSection from "../components/JoinSection";
import ChatBody from "../components/ChatBody";
import ChatFooter from "../components/ChatFooter";
import "../styles/chat.css";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [joined, setJoined] = useState(false);
  const [chatActive, setChatActive] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  /* SOCKET LISTENERS */
  useEffect(() => {
    socket.on("userCount", (count) => setUserCount(count));
    socket.on("chatActivated", () => setChatActive(true));
    socket.on("receiveMessage", (data) =>
      setMessages((prev) => [...prev, data])
    );
    socket.on("showTyping", (email) => setTypingUser(email));
    socket.on("hideTyping", () => setTypingUser(""));

    return () => {
      socket.off("userCount");
      socket.off("chatActivated");
      socket.off("receiveMessage");
      socket.off("showTyping");
      socket.off("hideTyping");
    };
  }, []);

  const handleJoin = () => {
    socket.emit("joinGeneral", user.userId);
    setJoined(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      senderName: user.name,
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };


    socket.emit("sendMessage", messageData);
    socket.emit("stopTyping");
    setMessage("");
  };

  let typingTimeout;

  const handleTyping = (value) => {
    setMessage(value);

    socket.emit("typing", user.name);

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping");
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!joined) {
    return (
      <div className={`chat-container ${darkMode ? "dark" : ""}`}>
        <ChatHeader
          userCount={userCount}
          handleLogout={handleLogout}
          userEmail={user.email}
          toggleTheme={toggleTheme}
          darkMode={darkMode}
        />
        <JoinSection userCount={userCount} handleJoin={handleJoin} />
      </div>
    );
  }

  return (
    <div className={`chat-container ${darkMode ? "dark" : ""}`}>
      <ChatHeader
        userCount={userCount}
        handleLogout={handleLogout}
        userEmail={user.name}
        toggleTheme={toggleTheme}
        darkMode={darkMode}
      />

      <ChatBody
        chatActive={chatActive}
        messages={messages}
        userEmail={user.name}
        typingUser={typingUser}
      />


      {chatActive && (
        <ChatFooter
          message={message}
          handleTyping={handleTyping}
          sendMessage={sendMessage}
        />
      )}
    </div>
  );
};

export default Chat;
