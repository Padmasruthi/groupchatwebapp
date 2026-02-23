import { useEffect, useRef } from "react";
// import backgrounImg from "../assets/chatbody-bg.jpg";

const ChatBody = ({ chatActive, messages, userEmail, typingUser }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  return (
    <div
      className="chat-body">
      {/* Scrollable Messages Wrapper */}
      <div className="chat-messages">

        {!chatActive && (
          <p className="waiting-text">
            Waiting for 3 users to join...
          </p>
        )}

        {chatActive &&
          messages.map((msg, index) => {
            const isMyMessage = msg.senderName === userEmail;

            return (
              <div
                key={index}
                className={
                  isMyMessage
                    ? "message-row my-row"
                    : "message-row"
                }
              >
                <div
                  className={
                    isMyMessage
                      ? "message-bubble my-bubble"
                      : "message-bubble"
                  }
                >
                  {!isMyMessage && (
                    <strong className="sender">
                      {msg.senderName}
                    </strong>
                  )}

                  <p className="text">{msg.text}</p>
                  <small className="time">{msg.time}</small>
                </div>
              </div>
            );
          })}

        {typingUser && typingUser !== userEmail && (
          <p className="typing-text">
            {typingUser} is typing...
          </p>
        )}

        <div ref={bottomRef}></div>

      </div>
    </div>
  );
};

export default ChatBody;