import backgrounImg from "../assets/chatbody-bg.jpg";

const JoinSection = ({ userCount, handleJoin }) => {
  return (
    <div
      className="join-section"
      style={{
        backgroundImage: `url(${backgrounImg})`,
      }}
    >
      <div className="join-overlay"></div>

      <div className="join-content">
        <h2>General Group Chat</h2>
        <p>Users Joined: {userCount}/3</p>
        <button onClick={handleJoin}>Join</button>
      </div>
    </div>
  );
};

export default JoinSection;