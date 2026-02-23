const ChatHeader = ({
  userCount,
  handleLogout,
  userEmail,
  toggleTheme,
  darkMode,
}) => {
  return (
    <div className="chat-header">
      <div className="header-left">
        <h2>💬 General Group</h2>
        <p className="online-text">🟢 {userCount}/3 Members Online</p>
        <small className="welcome-text">
          Welcome, {userEmail} ✨
        </small>
      </div>

      <div className="header-actions">
        <button className="theme-btn" onClick={toggleTheme}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
