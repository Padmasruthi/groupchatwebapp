import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

const ChatFooter = ({ message, handleTyping, sendMessage }) => {
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    handleTyping(message + emojiData.emoji);
  };

  return (
    <div className="chat-footer">
      <div className="emoji-wrapper">
        <button
          className="emoji-btn"
          onClick={() => setShowPicker(!showPicker)}
        >
          😀
        </button>

        {showPicker && (
          <div className="emoji-picker">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              width={400}
              height={350}
              previewConfig={{ showPreview: false }}
              searchDisabled={false}
              skinTonesDisabled
            />
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={(e) => handleTyping(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
      />

      <button className="footer-send-btn" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default ChatFooter;