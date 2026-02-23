import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import "../styles/auth.css";
import bgimg from "../assets/bgimg.jpg";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      login(data);
      navigate("/chat");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        className: "custom-toast",
      });
    }
  };

  return (
    <div
      className="auth-container"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      <div className="overlay"></div>

      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ?  <FaEye /> : <FaEyeSlash /> }
            </span>
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Login;