import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("https://your-backend.onrender.com");

const Chat = ({ user }) => {
  const [joined, setJoined] = useState(false);
  const [chatActive, setChatActive] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const typingTimeout = useRef(null);

  useEffect(() => {
    socket.on("userCount", setUserCount);
    socket.on("chatActivated", () => setChatActive(true));
    socket.on("chatDeactivated", () => setChatActive(false));
    socket.on("receiveMessage", (data) =>
      setMessages((prev) => [...prev, data])
    );

    return () => socket.disconnect();
  }, []);

  const joinChat = () => {
    socket.emit("joinGeneral", user.userId);
    setJoined(true);
  };

  const sendMessage = () => {
    if (!message) return;

    const data = {
      senderName: user.name,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("sendMessage", data);
    setMessage("");
  };

  if (!joined) {
    return (
      <div>
        <h2>General Group</h2>
        <p>{userCount}/3 Joined</p>
        <button onClick={joinChat}>Join</button>
      </div>
    );
  }

  return (
    <div>
      <h2>General Group Chat</h2>

      {!chatActive && <p>Waiting for 3 users...</p>}

      {messages.map((msg, i) => (
        <div key={i}>
          <strong>{msg.senderName}</strong>: {msg.text}
        </div>
      ))}

      {chatActive && (
        <>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
    </div>
  );
};

export default Chat;